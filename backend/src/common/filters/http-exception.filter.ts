import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse
            ) {
                const value = exceptionResponse.message;

                if (typeof value === 'string' || Array.isArray(value)) {
                    message = value as string | string[];
                }
            }
        } else {
            this.logger.error(
                `${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        response.status(status).json({
            status: 'error',
            code: status,
            data: {
                message,
            },
        });
    }
}