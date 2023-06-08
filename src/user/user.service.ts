import * as bcrypt from 'bcrypt';
import { PrismaService } from '@config/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { IPagination } from '@common/interfaces/pagination';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {}

    async exists(where: Prisma.UserWhereUniqueInput) {
        return (await this.prisma.user.findUnique({ where })) !== null;
    }

    async findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
        const user = await this.prisma.user.findUnique({ where });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async create(data: Prisma.UserCreateInput) {
        if (await this.exists({ email: data.email }))
            throw new ConflictException('User already exists');

        const salt = await bcrypt.genSalt(
            Number(this.configService.get<string>('SALT'))
        );

        const hashedPwd = await bcrypt.hash(data.password, salt);

        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPwd,
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
            orderBy,
        });
    }

    async update(
        userId: number,
        data: Prisma.UserUpdateInput
    ): Promise<UpdateUserDto> {
        if (!(await this.exists({ id: userId })))
            throw new NotFoundException('User not found');

        const user = await this.prisma.user.update({
            data: {
                ...data,
            },
            where: {
                id: userId,
            },
        });

        return UpdateUserDto.toDto(user);
    }

    async delete(userId: number): Promise<UserDto> {
        if (!(await this.exists({ id: userId })))
            throw new NotFoundException('User not found');

        const user = await this.prisma.user.delete({ where: { id: userId } });

        return UserDto.toDto(user);
    }
}
