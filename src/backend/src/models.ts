export interface NewComment {
  contents: string;
  parentId: number | null;
  recaptchaToken: string | undefined;
}

export interface DatabaseComment {
  id: number;
  contents: string;
  url: string;
  createdAt: Date;
  votes: number;
  parentId: number | null;
}

export interface Comment {
  id: number;
  parentId: number | null;
  contents: string;
  url: string;
  createdAt: string;
  votes: number;
  children: Comment[];
}
