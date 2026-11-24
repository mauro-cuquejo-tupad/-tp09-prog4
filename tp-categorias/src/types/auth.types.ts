export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  roles: string[];
}

export interface LoginResponse {
  mensaje: string;
}

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  password: string;
}
