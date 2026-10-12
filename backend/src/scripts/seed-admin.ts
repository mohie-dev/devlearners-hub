import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module.js';
import { User } from '../modules/users/entities/user.entity.js';
import { UserRole } from '../common/enums.js';
import { ConfigService } from '@nestjs/config';

async function seedAdmin() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const configService = app.get(ConfigService);
        const email = configService.getOrThrow<string>('ADMIN_EMAIL').trim().toLowerCase();
        const fullName = configService.getOrThrow<string>('ADMIN_FULL_NAME').trim();
        const password = configService.getOrThrow<string>('ADMIN_PASSWORD');

        if (!email || !fullName || !password) {
            throw new Error('ADMIN_EMAIL, ADMIN_FULL_NAME, and ADMIN_PASSWORD are required');
        }
        if (password.length < 8 || password.length > 72) {
            throw new Error('ADMIN_PASSWORD must be between 8 and 72 characters');
        }

        const dataSource = app.get(DataSource);
        const usersRepository = dataSource.getRepository(User);
        const existingUser = await usersRepository.findOneBy({ email });

        if (existingUser) {
            if (existingUser.role === UserRole.ADMIN) {
                console.log(`Admin account already exists: ${email}`);
                return;
            }

            existingUser.role = UserRole.ADMIN;
            await usersRepository.save(existingUser);
            console.log(`Existing account promoted to ADMIN: ${email}`);
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const admin = usersRepository.create({
            fullName,
            email,
            passwordHash,
            role: UserRole.ADMIN,
        });

        await usersRepository.save(admin);
        console.log(`Admin account created successfully: ${email}`);
    } finally {
        await app.close();
    }
}

seedAdmin().catch((error: unknown) => {
    console.error('Admin seed failed:', error);
    process.exitCode = 1;
});