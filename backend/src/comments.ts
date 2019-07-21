import { DatabaseComment, Comment, NewComment } from "./models";
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import { emitNewComment } from "./events";
import { knex } from "./database";
import { verifyToken, useRecaptcha } from "./recaptcha";

const router = express.Router();

const buildCommentTree = (flatComments: DatabaseComment[], startingComment?: DatabaseComment): Comment[] => {
  const buildCommentNode = (comment: DatabaseComment): Comment => ({
    id: comment.id,
    parentId: comment.parentId,
    contents: comment.contents,
    url: comment.url,
    createdAt: comment.createdAt.toISOString(),
    votes: comment.votes,
    children: flatComments.filter(c => c.parentId === comment.id).map(buildCommentNode)
  });
  if (startingComment !== undefined) {
    return flatComments.filter(c => c.id === startingComment.id).map(buildCommentNode);
  } else {
    return flatComments.filter(c => c.parentId === null).map(buildCommentNode);
  }
}

router.get('/:url/comments', async (req, res) => {
  const url = req.params.url;
  const flatComments: DatabaseComment[] = await knex.select().where({ url }).from('comments');
  const commentTree = buildCommentTree(flatComments);
  res.json(commentTree);
});

router.get('/:url/comments/count', async (req, res) => {
  const url = req.params.url;
  const [{count}] = await knex.count('id').where({ url }).from('comments');
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
  if (useRecaptcha) {
    if (!newComment.recaptchaToken) {
      return res.status(400).send('Missing reCAPTCHA token');
    }
    if (!await verifyToken(newComment.recaptchaToken)) {
      return res.status(400).send('Failed to verify reCAPTCHA token');
    }
  }
  const url = req.params.url;
  const [id] = await knex.insert({
    contents: newComment.contents,
    parentId: newComment.parentId,
    url
  }, 'id').into('comments') as [number];
  const [databaseComment] = await knex.select().where({ id }).from('comments') as [DatabaseComment];
  const allComments: DatabaseComment[] = await knex.select().where({ url }).from('comments');
  const commentTree = buildCommentTree(allComments, databaseComment);
  const comment = commentTree[0];
  emitNewComment(comment, url);
  res.json(comment);
});

export default router;
