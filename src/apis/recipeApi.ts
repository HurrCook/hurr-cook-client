import axiosInstance from './axiosInstance';
import type { AxiosError } from 'axios';

// ✅ 서버 기본 응답 형태 정의 (Swagger 기준)
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// ✅ Recipe 타입 (예시 — 서버 스펙에 맞게 수정 가능)
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

// ✅ 레시피 목록 조회
export const getRecipeList = async (): Promise<Recipe[]> => {
  try {
    const { data } = await axiosInstance.get<ApiResponse<Recipe[]>>('/recipes');
    console.log('✅ 서버 응답:', data);
    return data.data ?? [];
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse<null>>;
    console.error(
      '❌ 레시피 목록 API 에러:',
      err.response?.data || err.message,
    );
    throw err;
  }
};

// ✅ 레시피 상세 조회
export const getRecipeDetail = async (recipeId: number): Promise<Recipe> => {
  const { data } = await axiosInstance.get<ApiResponse<Recipe>>(
    `/recipes/${recipeId}`,
  );
  return data.data as Recipe;
};

// ✅ 레시피 등록
export const createRecipe = async (
  recipeData: Omit<Recipe, 'id'>,
): Promise<Recipe> => {
  const { data } = await axiosInstance.post<ApiResponse<Recipe>>(
    '/recipes',
    recipeData,
  );
  return data.data as Recipe;
};

// ✅ 레시피 수정
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

// ✅ 레시피 삭제
export const deleteRecipe = async (recipeId: number): Promise<boolean> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/recipes/${recipeId}`,
  );
  return data.success;
};
