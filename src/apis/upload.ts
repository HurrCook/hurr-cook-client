// src/apis/upload.ts
import axiosInstance from './axiosInstance';

export type UploadResponse = {
  success: boolean;
  message: string | null;
  data?: {
    // 백엔드 응답 구조에 맞게 확장
    items?: Array<{ name: string; qty?: number; unit?: string }>;
    imageUrl?: string;
  };
};

export async function uploadIngredientImage(
  file: File,
): Promise<UploadResponse> {
  const form = new FormData();
  // ⚠️ 백엔드에서 받는 파라미터명에 맞춰 key 지정 (예: "image" 또는 "file")
  form.append('image', file);

  // 필요하면 사용자 식별자 같은 메타 포함
  const userId = localStorage.getItem('userId');
  if (userId) form.append('userId', userId);

  // 업로드 엔드포인트 경로(백엔드에 맞게 바꿔도 됨)
  const { data } = await axiosInstance.post<UploadResponse>(
    '/api/ingredients/upload', // 예시: /api/ingredients/upload (axiosInstance baseURL에 /api가 포함되어 있으면 이렇게)
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}
