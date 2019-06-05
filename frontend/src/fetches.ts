import { Comment, NewComment } from './models';
import { superfetch } from './superfetch';


export const getComments = async (url: string): Promise<Comment[]> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = `${SERVER_URL}/${encodedUrl}/comments`;
  return await superfetch(commentsUrl);
}

export const postComment = async (url: string, comment: NewComment): Promise<Comment> => {
  const encodedUrl = encodeURIComponent(url);
  const commentsUrl = `${SERVER_URL}/${encodedUrl}/comments`;
  return await superfetch(commentsUrl, {
    method: 'POST',
    body: JSON.stringify(comment)
  });
}

export const getCommentCount = async (url: string): Promise<number> => {
  const encodedUrl = encodeURIComponent(url);
  const countUrl = `${SERVER_URL}/${encodedUrl}/comments/count`;
  return await superfetch(countUrl);
}
