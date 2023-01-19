export interface IGenericResponse {
    status: string;
    message?: string;
    data?: any;
    error?: any;
    errors?: Array<unknown>;
  }