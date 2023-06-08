import { Role, User } from '@prisma/client';

export class CreateUserDto {
    name: string;
    lastname: string;
    email: string;
    password: string;
    username: string;
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
