export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  comments?: Array<{
    id: number;
    documentId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    user?: {
      id: number;
      documentId: string;
      username: string;
      email: string;
      provider?: string;
      confirmed?: boolean;
      blocked?: boolean;
      createdAt?: string;
      updatedAt?: string;
      publishedAt?: string;
      locale?: string | null;
    };
  }>;
  user?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string | null;
  };
  category?: {
    id: number;
    documentId: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    locale?: string | null;
  };
}

export interface ArticlesResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ArticleResponse {
  data: Article;
  meta: object;
}

export interface GetArticlesOptions {
  page?: number;
  pageSize?: number;
  title?: string;
  categoryName?: string;
  populateAll?: boolean;
  populateCommentsUser?: boolean;
  populateUser?: boolean;
  populateCategory?: boolean;
}

export interface GetArticleDetailOptions {
  documentId: string;
  page?: number;
  pageSize?: number;
  title?: string;
  categoryName?: string;
  populateAll?: boolean;
  populateCommentsUser?: boolean;
  populateUser?: boolean;
  populateCategory?: boolean;
}

export interface CreateArticleInput {
  title: string;
  description: string;
  cover_image_url: string;
  category?: string; // category documentId (optional)
}

export interface UpdateArticleInput {
  title?: string;
  description?: string;
  cover_image_url?: string;
  category?: string; // category documentId (optional)
}
