import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { SubjectDepartment, SubjectLevel } from '../../../common/enums.js';
import { RegisterDto } from './register.dto.js';

const validProfile = {
    fullName: 'Test Student',
    email: 'student@example.test',
    password: 'safe-test-password',
};

describe('RegisterDto academic department validation', () => {
    it.each([SubjectLevel.FIRST, SubjectLevel.SECOND])(
        'allows level %s without a department',
        async (studyLevel) => {
            const dto = plainToInstance(RegisterDto, { ...validProfile, studyLevel });
            const errors = await validate(dto);

            expect(errors.map(({ property }) => property)).not.toContain('department');
        },
    );

    it('requires a department for level 3 and 4', async () => {
        const dto = plainToInstance(RegisterDto, {
            ...validProfile,
            studyLevel: SubjectLevel.THIRD,
        });
        const errors = await validate(dto);

        expect(errors.map(({ property }) => property)).toContain('department');
    });

    it('accepts a selected department for upper levels', async () => {
        const dto = plainToInstance(RegisterDto, {
            ...validProfile,
            studyLevel: SubjectLevel.FOURTH,
            department: SubjectDepartment.CS,
        });
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });
});
