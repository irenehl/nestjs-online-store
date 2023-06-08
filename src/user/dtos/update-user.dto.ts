import { User } from '@prisma/client';

export class UpdateUserDto {
    id: number;
    name: string;
    lastname: string;
    email: string;
    username: string;
    password: string;

    static toDto(user: User): UpdateUserDto {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }
}
