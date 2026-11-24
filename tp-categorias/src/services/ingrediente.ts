import { axiosInstance } from "../api/axiosInstance";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await axiosInstance.get<Ingrediente[]>("/ingredientes/");
  return response.data;
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const response = await axiosInstance.get<Ingrediente>(`/ingredientes/${id}`);
  return response.data;
};

export const createIngrediente = async (data: IngredienteFormData): Promise<Ingrediente> => {
  const response = await axiosInstance.post<Ingrediente>("/ingredientes/", data);
  return response.data;
};

export const updateIngrediente = async (
  id: number,
  data: IngredienteFormData
): Promise<Ingrediente> => {
  const response = await axiosInstance.put<Ingrediente>(`/ingredientes/${id}`, data);
  return response.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/ingredientes/${id}`);
};
