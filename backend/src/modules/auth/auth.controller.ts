import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a student account', description: 'Creates a student account and returns an access token.' })
    @ApiSuccessResponse(AuthResponseDto, HttpStatus.CREATED, 'Student account created successfully')
    @ApiBadRequestResponse({ description: 'Request validation failed' })
    @ApiConflictResponse({ description: 'Email is already registered' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login', description: 'Validates credentials and returns an access token.' })
    @ApiSuccessResponse(AuthResponseDto, HttpStatus.OK, 'Login successful')
    @ApiBadRequestResponse({ description: 'Request validation failed' })
    @ApiUnauthorizedResponse({ description: 'Email or password is incorrect' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}