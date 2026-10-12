import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto.js';

export const ApiSuccessResponse = (model: Type<unknown>, statusCode = 200, description = 'Successful response') =>
    applyDecorators(
        ApiExtraModels(ApiResponseDto, model),
        ApiResponse({
            status: statusCode,
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiResponseDto) },
                    {
                        type: 'object',
                        properties: {
                            code: { type: 'number', example: statusCode },
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );