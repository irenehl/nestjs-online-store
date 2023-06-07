import * as bcrypt from 'bcrypt';
import { PrismaService } from '@config/prisma.service';
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    private async exists(where: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({ where }) !== null;
    }

    async findOne(where: Prisma.UserWhereUniqueInput) {
        const user = await this.prisma.user.findUnique({ where });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async create(data: Prisma.UserCreateInput) {
        if (await this.exists({ email: data.email }))
            throw new ConflictException('User already exists');

        return this.prisma.user.create({
            data: {
                ...data,
            },
        });
    }
}
