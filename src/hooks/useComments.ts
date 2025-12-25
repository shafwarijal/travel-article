import { commentsService } from '@/services/comments.service';
import type { CommentsResponse, CreateCommentPayload } from '@/types/comments';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseCommentsOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  populateAll?: boolean;
  populateUser?: boolean;
}

export const useComments = ({
  page = 1,
  pageSize = 10,
  sort = 'createdAt:desc',
  populateAll = false,
  populateUser = false,
}: UseCommentsOptions = {}) => {
  return useQuery<CommentsResponse>({
    queryKey: ['comments', { page, pageSize, sort, populateAll, populateUser }],
    queryFn: () =>
      commentsService.getCommentByFilter({
        page,
        pageSize,
        sort,
        populateAll,
        populateUser,
      }),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentPayload) =>
      commentsService.createComment(data),
    onSuccess: () => {
      // Invalidate article query to refetch with updated comments
      queryClient.invalidateQueries({
        queryKey: ['article'],
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      content,
    }: {
      documentId: string;
      content: string;
    }) => commentsService.updateComment(documentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article'],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      commentsService.deleteComment(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['article'],
      });
    },
  });
};
