import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async findByEmailForAuth(email: string): Promise<User | null> {
        return this.usersRepository.createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async createStudent(dto: CreateStudentDto): Promise<User> {
        const user = this.usersRepository.create(dto);
        return this.usersRepository.save(user);
    }


    async updateProfile(
        id: string,
        dto: { fullName: string },
    ): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) return null;

        user.fullName = dto.fullName;

        return this.usersRepository.save(user);
    }

}