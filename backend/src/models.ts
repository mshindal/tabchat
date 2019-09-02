export interface NewComment {
  contents: string;
  parentId: number | null;
  recaptchaToken: string | undefined;
  deleteKey: string;
  originatingSocketID?: string;
}

export interface DatabaseComment {
  id: number;
  contents: string;
  url: string;
  createdAt: Date;
  votes: number;
  parentId: number | null;
  deleteKey: string;
  isDeleted: boolean;
}

export interface Comment {
  id: number;
  parentId: number | null;
  contents: string;
  url: string;
  createdAt: string;
  votes: number;
  children: Comment[];
  canDelete: boolean;
  isDeleted: boolean;
}
