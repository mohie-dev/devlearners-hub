import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.js';

@Injectable()
export class TransformResponseInterceptor
    implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<unknown>> {
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((data): ApiResponse<unknown> => ({
                status: 'success',
                code: response.statusCode,
                data,
            })),
        );
    }
}