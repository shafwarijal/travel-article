import { articleService } from '@/services/articles.service';
import type {
  Article,
  ArticlesResponse,
  CreateArticleInput,
  GetArticleDetailOptions,
  UpdateArticleInput,
} from '@/types/articles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseArticlesOptions {
  categoryName?: string | null;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch articles with filtering and pagination
 *
 * @param options - Filtering and pagination options
 * @returns TanStack Query result with articles data
 */
export const useArticles = ({
  categoryName,
  page = 1,
  pageSize = 10,
  enabled = true,
}: UseArticlesOptions = {}) => {
  return useQuery<ArticlesResponse>({
    queryKey: ['articles', { categoryName, page, pageSize }],
    queryFn: () =>
      articleService.getArticlesByFilter({
        ...(categoryName && { categoryName }),
        page,
        pageSize,
      }),
    enabled,
  });
};

export const useArticleDetail = ({
  documentId,
  populateAll = false,
  populateCommentsUser = false,
}: GetArticleDetailOptions) => {
  return useQuery<Article>({
    queryKey: ['article', documentId, { populateAll, populateCommentsUser }],
    queryFn: () =>
      articleService.getArticleByDocumentId(documentId, {
        populateAll,
        populateCommentsUser,
      }),
    enabled: !!documentId,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleInput) =>
      articleService.createArticle(data),
    onSuccess: () => {
      // Invalidate articles list to refetch
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: UpdateArticleInput;
    }) => articleService.updateArticle(documentId, data),
    onSuccess: (_, variables) => {
      // Invalidate both article detail and articles list
      queryClient.invalidateQueries({
        queryKey: ['article', variables.documentId],
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      articleService.deleteArticle(documentId),
    onSuccess: () => {
      // Invalidate articles list
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
