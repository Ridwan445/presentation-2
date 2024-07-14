import { Response } from "express";

class ExpressResponse {
  public successResponse(res: Response, data: any, message: string, statusCode: number) {
    return res.status(statusCode).json({
      status: 'success',
      message: message,
      data: data,
    });
  }

  public errorResponse(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({
      status: 'error',
      message: message,
    });
  }
}

export default ExpressResponse;

