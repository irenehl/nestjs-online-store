import { User } from '@prisma/client';

export class UpdateUserDto {
    name: string;
    lastname: string;
    email: string;
    username: string;
    password: string;

    static toDto(user: User): UpdateUserDto {
        return {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }
}
