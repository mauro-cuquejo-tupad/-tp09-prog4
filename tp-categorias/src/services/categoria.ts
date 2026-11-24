import { axiosInstance } from "../api/axiosInstance";
import type { Categoria, CategoriaFormData } from "../types/categoria";

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await axiosInstance.get<Categoria[]>("/categorias/");
  return response.data;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const response = await axiosInstance.get<Categoria>(`/categorias/${id}`);
  return response.data;
};

export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  const response = await axiosInstance.post<Categoria>("/categorias/", data);
  return response.data;
};

export const updateCategoria = async (
  id: number,
  data: CategoriaFormData
): Promise<Categoria> => {
  const response = await axiosInstance.put<Categoria>(`/categorias/${id}`, data);
  return response.data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categorias/${id}`);
};
