import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserData } from '../interfaces/current-user.interface.js';

export const CurrentUser = createParamDecorator(
    (data: keyof CurrentUserData | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<{
            user?: CurrentUserData;
        }>();

        return data ? request.user?.[data] : request.user;
    },
);