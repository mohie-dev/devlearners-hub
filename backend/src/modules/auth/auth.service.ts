import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface.js';
import { CreateStudentDto } from '../users/dto/create-student.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();
        if (await this.usersService.findByEmailForAuth(email)) {
            throw new ConflictException('Email is already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);
        let user: User;

        try {
            const createStudentDto: CreateStudentDto = {
                fullName: dto.fullName.trim(),
                email,
                passwordHash,
            };

            user = await this.usersService.createStudent(createStudentDto);
        } catch (error) {
            if (this.isEmailConflict(error)) throw new ConflictException('Email is already registered');
            throw error;
        }

        return this.createAuthResponse(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmailForAuth(dto.email.trim().toLowerCase());
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.createAuthResponse(user);
    }

    async getMe(userId: string) {
        const user = await this.usersService.findById(userId);

        if (!user) throw new UnauthorizedException('User account no longer exists');

        return { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    }

    private async createAuthResponse(user: User) {
        const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: '15m',
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
        };
    }

    private isEmailConflict(error: unknown): boolean {
        if (!error || typeof error !== 'object' || !('driverError' in error)) return false;
        const driverError = (error as { driverError?: { code?: string } }).driverError;
        return driverError?.code === '23505';
    }
}