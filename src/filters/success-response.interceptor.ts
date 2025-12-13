import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';
import { SUCCESS_MESSAGE_KEY } from './success-message.decorator';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const handler = context.getHandler();
    const reflector = new Reflector();

    const customMessage = reflector.get<string>(SUCCESS_MESSAGE_KEY, handler);

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: customMessage ?? 'Request successful',
        data,
      })),
    );
  }
}
