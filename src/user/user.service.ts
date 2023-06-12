import * as bcrypt from 'bcrypt';
import { PrismaService } from '@config/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { IPagination } from '@common/interfaces/pagination';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
    private salt: string;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {
        this.salt = bcrypt.genSaltSync(
            Number(this.configService.get<string>('SALT'))
        );
    }

    async exists(where: Prisma.UserWhereUniqueInput) {
        return (await this.prisma.user.findUnique({ where })) !== null;
    }

    async findOne(
        where: Prisma.UserWhereUniqueInput,
        isPrivate = true
    ): Promise<UserDto | User> {
        const user = await this.prisma.user
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new NotFoundException('User not found');
            });

        return isPrivate ? UserDto.toDto(user) : user;
    }

    async create(data: Prisma.UserCreateInput) {
        if (await this.exists({ email: data.email }))
            throw new ConflictException('User already exists');

        const hashedPwd = await bcrypt.hash(data.password, this.salt);

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPwd,
                cart:
                    data.role && data.role === Role.CLIENT
                        ? {
                              create: {},
                          }
                        : undefined,
            },
        });

        return UserDto.toDto(user);
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput;
            orderBy?: Prisma.UserOrderByWithAggregationInput;
        }
    ): Promise<UserDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.user.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                recovery: true,
                role: true,
            },
            orderBy,
        });
    }

    async update(
        userId: number,
        data: Prisma.UserUpdateInput
    ): Promise<UserDto> {
        if (!(await this.exists({ id: userId })))
            throw new NotFoundException('User not found');

        const user = await this.prisma.user.update({
            data: {
                ...data,
                password: data.password
                    ? await bcrypt.hash(data.password as string, this.salt)
                    : undefined,
            },
            where: {
                id: userId,
            },
        });

        return UserDto.toDto(user);
    }

    async delete(userId: number): Promise<UserDto> {
        if (!(await this.exists({ id: userId })))
            throw new NotFoundException('User not found');

        const user = await this.prisma.user.delete({ where: { id: userId } });

        return UserDto.toDto(user);
    }
}
