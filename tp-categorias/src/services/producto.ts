import { axiosInstance } from "../api/axiosInstance";
import type { Producto, ProductoFormData } from "../types/producto";

export const getProductos = async (): Promise<Producto[]> => {
  const response = await axiosInstance.get<Producto[]>("/productos/");
  return response.data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const response = await axiosInstance.get<Producto>(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (data: ProductoFormData): Promise<Producto> => {
  const response = await axiosInstance.post<Producto>("/productos/", data);
  return response.data;
};

export const updateProducto = async (
  id: number,
  data: ProductoFormData
): Promise<Producto> => {
  const response = await axiosInstance.put<Producto>(`/productos/${id}`, data);
  return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/productos/${id}`);
};
