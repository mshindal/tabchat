import { DatabaseComment, Comment, NewComment } from "./models";
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import { emitNewComment, emitDeleteComment } from "./events";
import { knex } from "./database";
import { verifyToken } from "./recaptcha";
import configuration from "./configuration";

const router = express.Router();

const sortByDateAscending = (a: DatabaseComment, b: DatabaseComment) => b.createdAt.getTime() - a.createdAt.getTime();

const buildCommentTree = (flatComments: DatabaseComment[], startingComment?: DatabaseComment, deleteKey?: string): Comment[] => {
  const buildCommentNode = (comment: DatabaseComment): Comment => ({
    id: comment.id,
    parentId: comment.parentId,
    contents: comment.contents,
    url: comment.url,
    createdAt: comment.createdAt.toISOString(),
    votes: comment.votes,
    children: flatComments.filter(c => c.parentId === comment.id).sort(sortByDateAscending).map(buildCommentNode),
    canDelete: comment.isDeleted === false && deleteKey !== undefined && deleteKey === comment.deleteKey,
    isDeleted: comment.isDeleted
  });
  if (startingComment !== undefined) {
    return flatComments.filter(c => c.id === startingComment.id).sort(sortByDateAscending).map(buildCommentNode);
  } else {
    return flatComments.filter(c => c.parentId === null).sort(sortByDateAscending).map(buildCommentNode);
  }
}

router.get('/:url/comments', async (req, res) => {
  const { url } = req.params;
  const { deleteKey } = req.query;
  const flatComments: DatabaseComment[] = await knex.select().where({ url }).from('comments');
  const commentTree = buildCommentTree(flatComments, undefined, deleteKey);
  res.json(commentTree);
});

router.get('/:url/comments/count', async (req, res) => {
  const { url } = req.params;
  const [{count}] = await knex.count('id').where({ url, isDeleted: false }).from('comments');
  res.json(Number(count));
});

// 10 comments max allowed per minute per IP
const rateLimiter = new rateLimit({
  windowMs: 1000 * 60,
  max: 10
});

router.post('/:url/comments', rateLimiter, async (req, res) => {
  const newComment: NewComment = req.body;
  if (!newComment || !newComment.contents) {
    return res.status(400).send('Comment is malformed or empty');
  }
  if (!newComment.deleteKey) {
    return res.status(400).send('Delete key is missing');
  }
  if (newComment.contents.length > configuration.maxCommentLength) {
    return res.status(400).send('Comment is too long')
  }
  if (newComment.deleteKey.length > 700) {
    return res.status(400).send('Delete key is too long');
  }
  if (configuration.useRecaptcha) {
    if (!newComment.recaptchaToken) {
      return res.status(400).send('Missing reCAPTCHA token');
    }
    if (!await verifyToken(newComment.recaptchaToken)) {
      return res.status(400).send('Failed to verify reCAPTCHA token');
    }
  }
  const { url } = req.params;
  const [id]: Array<number> = await knex.insert({
    contents: newComment.contents,
    parentId: newComment.parentId,
    url,
    deleteKey: newComment.deleteKey
  } as DatabaseComment, 'id').into('comments');
  const [databaseComment] = await knex.select().where({ id }).from('comments') as [DatabaseComment];
  const allComments: DatabaseComment[] = await knex.select().where({ url }).from('comments');
  const commentTree = buildCommentTree(allComments, databaseComment, newComment.deleteKey);
  const comment = commentTree[0];
  emitNewComment(comment, url, newComment.originatingSocketID);
  res.json(comment);
});

router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { deleteKey } = req.query;
  if (!id) {
    return res.status(400).send('ID is missing');
  }
  if (!deleteKey) {
    return res.status(400).send('Delete key is missing');
  }
  const [databaseComment]: DatabaseComment[] = await knex.select().where({ id }).from('comments');
  if (databaseComment === undefined) {
    return res.status(404).send(`A comment with an ID of ${id} doesn't exist`);
  }
  if (databaseComment.deleteKey !== deleteKey) {
    return res.status(400).send(`Delete key doesn't match`);
  }
  console.log(`Deleting comment with ID ${id}`);
  const url = databaseComment.url;
  await knex.update({
    contents: 'Deleted',
    isDeleted: true
  }).from('comments').where({ id });
  emitDeleteComment(Number(id), url);
  return res.status(200).send();
});



export default router;
