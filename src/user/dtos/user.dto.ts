import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UserDto {
    id: number;

    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    recovery?: string | null;

    @IsEnum(Role)
    @IsOptional()
    role: Role;
}
