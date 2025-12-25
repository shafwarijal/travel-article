import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
    staleTime: 1000 * 60 * 10, // Categories don't change often, cache for 10 minutes
  });
};
