import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MeService } from './me.service.js';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
    constructor(private readonly meService: MeService) { }

    @Get()
    @ApiOperation({ summary: 'Get the current authenticated user profile' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User account not found' })
    getProfile(@CurrentUser('id') userId: string) {
        return this.meService.getProfile(userId);
    }

    @Get('tasks')
    @ApiOperation({
        summary: 'Get published tasks matching the current student academic profile',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Student role required' })
    getMyTasks(@CurrentUser('id') userId: string) {
        return this.meService.getMyTasks(userId);
    }
}
