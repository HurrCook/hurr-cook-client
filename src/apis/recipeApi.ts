import axiosInstance from '@/apis/axiosInstance';

// API 응답 제네릭 타입 정의
interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

// 레시피 타입
export interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
}
interface ApiIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

//recipes GET 요청
export const getRecipeList = async (): Promise<Recipe[]> => {
  try {
    const { data } =
      await axiosInstance.get<
        ApiResponse<{ recipes: { id: string; title: string; image: string }[] }>
      >('/recipes');

    console.log('✅ 서버 응답:', data);

    // recipes 배열이 존재하는 경우만 반환
    if (data.success && data.data && Array.isArray(data.data.recipes)) {
      return data.data.recipes.map((r) => ({
        id: r.id,
        name: r.title,
        image: r.image,
        ingredients: [],
        instructions: [],
      }));
    }

    return [];
  } catch (error) {
    console.error('❌ 레시피 목록 API 에러:', error);
    return [];
  }
};

export const getRecipeDetail = async (recipeId: string) => {
  const { data } = await axiosInstance.get(`/recipes/${recipeId}`);

  if (!data?.data) {
    throw new Error('레시피 데이터를 불러오지 못했습니다.');
  }

  const r = data.data;

  // 명시적 타입 적용
  return {
    id: recipeId,
    name: r.title,
    image: r.image,
    ingredients: (r.ingredients as ApiIngredient[]).map((ing) => ({
      name: ing.name,
      amount: `${ing.amount}${ing.unit ?? ''}`,
    })),
    instructions: r.steps ?? [],
  };
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
  recipeId: string,
  recipeData: Partial<Recipe>,
): Promise<Recipe> => {
  const { data } = await axiosInstance.put<ApiResponse<Recipe>>(
    `/recipes/${recipeId}`,
    recipeData,
  );

  if (!data.success || !data.data) {
    console.warn('⚠️ 서버에서 수정된 레시피 데이터를 반환하지 않았습니다.');
    return {
      id: recipeId,
      name: recipeData.name || '이름없음',
      image: recipeData.image || '',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
    };
  }

  return data.data as Recipe;
};

export const deleteRecipe = async (recipeId: string): Promise<boolean> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/recipes/${recipeId}`,
  );
  return data.success;
};
