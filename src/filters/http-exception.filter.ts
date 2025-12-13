import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class BaseException extends HttpException {
  protected statusCode: string;
  constructor(message: string, statusCode: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.setStatusCode(statusCode);
  }

  public getStatusCode(): string {
    return this.statusCode;
  }

  public setStatusCode(statusCode: string): void {
    this.statusCode = statusCode;
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    // If NestJS HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();

      if (res?.message) {
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      } else if (typeof res === 'string') {
        message = res;
      }
    } else {
      // Generic error (AWS, DynamoDB, etc)
      message = exception?.message || message;
    }
    console.error('🔥 ERROR CAUGHT:', message);

    return response.status(status).json({
      success: false,
      message,
    });
  }
}
