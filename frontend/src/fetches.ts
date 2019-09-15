import { Comment, NewComment } from '../../backend/src/models';
import { superfetch, emptyResponseHandler } from './superfetch';
import configuration from '../../backend/src/configuration';


export const getComments = async (url: string, deleteKey?: string): Promise<Comment[]> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = new URL(`${configuration.serverURL}/${encodedUrl}/comments`);
  commentsUrl.searchParams.append('deleteKey', deleteKey);
  return await superfetch(commentsUrl.href);
}

export const postComment = async (url: string, comment: NewComment): Promise<Comment> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = `${configuration.serverURL}/${encodedUrl}/comments`;
  return await superfetch(commentsUrl, {
    method: 'POST',
    body: JSON.stringify(comment)
  });
}

export const deleteComment = async (id: number, deleteKey: string) => {
  const url = new URL(`${configuration.serverURL}/comments/${id}`);
  url.searchParams.append('deleteKey', deleteKey);
  return await superfetch(url.href, {
    method: 'DELETE',
    responseHandler: emptyResponseHandler
  });
}

export const getCommentCount = async (url: string): Promise<number> => {
  const encodedUrl = encodeURIComponent(url);
  const countUrl = `${configuration.serverURL}/${encodedUrl}/comments/count`;
  return await superfetch(countUrl);
}
