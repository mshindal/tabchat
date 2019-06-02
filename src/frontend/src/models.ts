export interface Comment {
  id: number;
  parentId: number | null;
  contents: string;
  url: string;
  createdAt: string;
  votes: number;
  children: Comment[];
}

export interface NewComment {
  contents: string;
  parentId: number | null;
  recaptchaToken: string | undefined;
}
