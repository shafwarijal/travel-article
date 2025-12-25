import axiosInstance from '@/lib/axios';
import type {
  Article,
  ArticleResponse,
  ArticlesResponse,
  CreateArticleInput,
  GetArticlesOptions,
  UpdateArticleInput,
} from '@/types/articles';

export const articleService = {
  async getArticles(): Promise<Article[]> {
    const response = await axiosInstance.get<ArticlesResponse>('/api/articles');
    return response.data.data;
  },

  async getArticle(documentId: string): Promise<Article> {
    const response = await axiosInstance.get<ArticleResponse>(
      `/api/articles/${documentId}`,
    );
    return response.data.data;
  },

  async getArticleByDocumentId(
    documentId: string,
    options: { populateAll?: boolean; populateCommentsUser?: boolean } = {},
  ): Promise<Article> {
    const { populateAll = false, populateCommentsUser = false } = options;

    const params: Record<string, string | boolean> = {};

    if (populateAll) {
      params['populate'] = '*';
    } else {
      params['populate[user]'] = '*';
      params['populate[category]'] = '*';
      if (populateCommentsUser) {
        params['populate[comments][populate][user]'] = '*';
      }
    }

    const response = await axiosInstance.get<ArticleResponse>(
      `/api/articles/${documentId}`,
      { params },
    );
    return response.data.data;
  },

  async getArticlesByFilter(
    options: GetArticlesOptions = {},
  ): Promise<ArticlesResponse> {
    const {
      page = 1,
      pageSize = 10,
      title,
      categoryName,
      populateAll = false,
      populateCommentsUser = false,
      populateUser = true,
      populateCategory = true,
    } = options;

    const params: Record<string, string | number | boolean> = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    };

    // Populate parameters - cleaner conditional logic
    if (populateAll) {
      params['populate'] = '*';
    } else {
      if (populateUser) params['populate[user]'] = '*';
      if (populateCategory) params['populate[category]'] = '*';
      if (populateCommentsUser)
        params['populate[comments][populate][user]'] = '*';
    }

    // Filter parameters - only add if defined
    if (title) params['filters[title][$containsi]'] = title;
    if (categoryName) params['filters[category][name][$eqi]'] = categoryName;

    const response = await axiosInstance.get<ArticlesResponse>(
      '/api/articles',
      { params },
    );

    return response.data;
  },

  async createArticle(data: CreateArticleInput): Promise<Article> {
    const response = await axiosInstance.post<ArticleResponse>(
      '/api/articles',
      { data },
    );
    return response.data.data;
  },

  async updateArticle(
    documentId: string,
    data: UpdateArticleInput,
  ): Promise<Article> {
    const response = await axiosInstance.put<ArticleResponse>(
      `/api/articles/${documentId}`,
      { data },
    );
    return response.data.data;
  },

  async deleteArticle(documentId: string): Promise<void> {
    await axiosInstance.delete(`/api/articles/${documentId}`);
  },
};
