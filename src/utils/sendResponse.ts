import type { Res } from "../types";

interface IResponseData<T> {
  succces: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: {};
}

export const sendResponse = <T>(res: Res, data: IResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.succces,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    pagination: data.pagination,  
  });
};
