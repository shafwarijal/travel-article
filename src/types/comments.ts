export interface Comment {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  articleId: number;
  publishedAt: string;
  locale: string | null;
  user?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
  };
}

export interface CommentsResponse {
  data: Comment[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CommentResponse {
  data: Comment;
  meta: object;
}

export interface GetCommentsOptions {
  page?: number;
  pageSize?: number;
  populateAll?: boolean;
  populateArticle?: boolean;
  populateUser?: boolean;
  sort?: string;
}

export interface CreateCommentPayload {
  content: string;
  articleId: number;
}
