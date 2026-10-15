import { BadRequestException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SubjectDepartment, SubjectLevel, UserRole } from '../../common/enums.js';
import type { UsersService } from '../users/users.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';

vi.mock('bcrypt', () => ({
    hash: vi.fn().mockResolvedValue('password-hash'),
    compare: vi.fn(),
}));

describe('AuthService.register academic department', () => {
    let authService: AuthService;
    let usersService: {
        findByEmailForAuth: ReturnType<typeof vi.fn>;
        createStudent: ReturnType<typeof vi.fn>;
    };
    let jwtService: { signAsync: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        usersService = {
            findByEmailForAuth: vi.fn().mockResolvedValue(null),
            createStudent: vi.fn().mockImplementation(async (dto) => ({
                id: 'student-1',
                ...dto,
                role: UserRole.STUDENT,
            })),
        };
        jwtService = { signAsync: vi.fn().mockResolvedValue('test-token') };
        authService = new AuthService(
            usersService as unknown as UsersService,
            jwtService as unknown as JwtService,
        );
    });

    it.each([SubjectLevel.FIRST, SubjectLevel.SECOND])(
        'assigns GENERAL automatically for level %s',
        async (studyLevel) => {
            const result = await authService.register({
                fullName: 'Test Student',
                email: 'student@example.test',
                password: 'safe-test-password',
                studyLevel,
            } as RegisterDto);

            expect(usersService.createStudent).toHaveBeenCalledWith(
                expect.objectContaining({
                    department: SubjectDepartment.GENERAL,
                    studyLevel,
                }),
            );
            expect(result.user.department).toBe(SubjectDepartment.GENERAL);
        },
    );

    it.each([
        [SubjectLevel.THIRD, SubjectDepartment.CS],
        [SubjectLevel.FOURTH, SubjectDepartment.IT],
    ])('preserves the selected department for level %s', async (studyLevel, department) => {
        await authService.register({
            fullName: 'Test Student',
            email: 'student@example.test',
            password: 'safe-test-password',
            studyLevel,
            department,
        } as RegisterDto);

        expect(usersService.createStudent).toHaveBeenCalledWith(
            expect.objectContaining({ department, studyLevel }),
        );
    });

    it('rejects missing department for level 3 or 4', async () => {
        await expect(
            authService.register({
                fullName: 'Test Student',
                email: 'student@example.test',
                password: 'safe-test-password',
                studyLevel: SubjectLevel.THIRD,
            } as RegisterDto),
        ).rejects.toBeInstanceOf(BadRequestException);
        expect(usersService.createStudent).not.toHaveBeenCalled();
    });
});
