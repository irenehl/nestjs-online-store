import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import * as Joi from 'joi';

export const CreateUserDtoSchema = Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    role: Joi.string().optional(),
});

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    username: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    static toDto(user: User): CreateUserDto {
        return {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            username: user.password,
            role: user.role,
        };
    }
}
