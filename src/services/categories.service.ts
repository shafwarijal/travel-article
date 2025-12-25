import axiosInstance from '@/lib/axios';
import type {
  CategoriesResponse,
  Category,
  CategoryResponse,
} from '@/types/categories';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const response =
      await axiosInstance.get<CategoriesResponse>('/api/categories');
    return response.data.data;
  },

  async getCategory(documentId: string): Promise<Category> {
    const response = await axiosInstance.get<CategoryResponse>(
      `/api/categories/${documentId}`,
    );
    return response.data.data;
  },
};
