import { Comment, NewComment } from '../../backend/src/models';
import { superfetch, emptyResponseHandler } from './superfetch';


export const getComments = async (url: string, deleteKey?: string): Promise<Comment[]> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = new URL(`${SERVER_URL}/${encodedUrl}/comments`);
  commentsUrl.searchParams.append('deleteKey', deleteKey);
  return await superfetch(commentsUrl.href);
}

export const postComment = async (url: string, comment: NewComment): Promise<Comment> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = `${SERVER_URL}/${encodedUrl}/comments`;
  return await superfetch(commentsUrl, {
    method: 'POST',
    body: JSON.stringify(comment)
  });
}

export const deleteComment = async (id: number, deleteKey: string) => {
  const url = new URL(`${SERVER_URL}/comments/${id}`);
  url.searchParams.append('deleteKey', deleteKey);
  return await superfetch(url.href, {
    method: 'DELETE',
    responseHandler: emptyResponseHandler
  });
}

export const getCommentCount = async (url: string): Promise<number> => {
  const encodedUrl = encodeURIComponent(url);
  const countUrl = `${SERVER_URL}/${encodedUrl}/comments/count`;
  return await superfetch(countUrl);
}
