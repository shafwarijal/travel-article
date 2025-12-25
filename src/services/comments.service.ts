import axiosInstance from '@/lib/axios';
import type {
  Comment,
  CommentResponse,
  CommentsResponse,
  GetCommentsOptions,
} from '@/types/comments';

export const commentsService = {
  async getComments(): Promise<Comment[]> {
    const response = await axiosInstance.get<CommentsResponse>('/api/comments');
    return response.data.data;
  },

  async getComment(documentId: string): Promise<Comment> {
    const response = await axiosInstance.get<CommentResponse>(
      `/api/comments/${documentId}`,
    );
    return response.data.data;
  },

  async getCommentByFilter(
    options: GetCommentsOptions = {},
  ): Promise<CommentsResponse> {
    const {
      page = 1,
      pageSize = 10,
      populateAll = false,
      populateArticle = false,
      populateUser = false,
      sort = 'createdAt:desc',
    } = options;

    const params: Record<string, string | number | boolean> = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      sort: sort,
    };

    // Populate parameters
    if (populateAll) {
      params['populate'] = '*';
    } else {
      if (populateArticle) params['populate[article]'] = '*';
      if (populateUser) params['populate[user]'] = '*';
    }

    const response = await axiosInstance.get<CommentsResponse>(
      '/api/comments',
      {
        params,
      },
    );

    return response.data;
  },

  async getCommentsByArticle(
    articleDocumentId: string,
    options: GetCommentsOptions = {},
  ): Promise<CommentsResponse> {
    const {
      page = 1,
      pageSize = 25,
      populateAll = false,
      sort = 'createdAt:desc',
    } = options;

    const params: Record<string, string | number | boolean> = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      sort: sort,
      'filters[article][documentId][$eq]': articleDocumentId,
    };

    if (populateAll) {
      params['populate'] = '*';
    } else {
      params['populate[user]'] = '*';
    }

    const response = await axiosInstance.get<CommentsResponse>(
      '/api/comments',
      { params },
    );
    return response.data;
  },

  async createComment(data: {
    content: string;
    articleId: number;
  }): Promise<Comment> {
    const response = await axiosInstance.post<CommentResponse>(
      '/api/comments',
      {
        data: {
          content: data.content,
          article: data.articleId,
        },
      },
    );
    return response.data.data;
  },

  async updateComment(
    documentId: string,
    data: { content: string },
  ): Promise<Comment> {
    const response = await axiosInstance.put<CommentResponse>(
      `/api/comments/${documentId}`,
      { data },
    );
    return response.data.data;
  },

  async deleteComment(documentId: string): Promise<void> {
    await axiosInstance.delete(`/api/comments/${documentId}`);
  },
};
