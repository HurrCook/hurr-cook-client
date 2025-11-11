import axiosInstance from './axiosInstance';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export const getRecipeList = async (): Promise<Recipe[]> => {
  try {
    const { data } = await axiosInstance.get<ApiResponse<Recipe[]>>('/recipes');
    console.log('✅ 서버 응답:', data);

    // null or object 보호
    if (!data.data) return [];
    if (!Array.isArray(data.data)) return [data.data];
    return data.data;
  } catch (error: unknown) {
    console.error('❌ 레시피 목록 API 에러:', error);
    return [];
  }
};

export const getRecipeDetail = async (recipeId: number): Promise<Recipe> => {
  const { data } = await axiosInstance.get<ApiResponse<Recipe>>(
    `/recipes/${recipeId}`,
  );
  return data.data as Recipe;
};

export const createRecipe = async (
  recipeData: Omit<Recipe, 'id'>,
): Promise<Recipe> => {
  const { data } = await axiosInstance.post<ApiResponse<Recipe>>(
    '/recipes',
    recipeData,
  );
  return data.data as Recipe;
};

export const updateRecipe = async (
  recipeId: number,
  recipeData: Partial<Recipe>,
): Promise<Recipe> => {
  const { data } = await axiosInstance.put<ApiResponse<Recipe>>(
    `/recipes/${recipeId}`,
    recipeData,
  );
  return data.data as Recipe;
};

export const deleteRecipe = async (recipeId: number): Promise<boolean> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/recipes/${recipeId}`,
  );
  return data.success;
};
