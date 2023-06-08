import { Role, User } from '@prisma/client';

export class UserDto {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string;
    recovery?: string | null;
    role: Role;

    static toDto(user: User): UserDto {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            recovery: user.recovery,
            role: user.role,
        };
    }
}
