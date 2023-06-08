import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [UserService, PrismaService, ConfigService],
    controllers: [UserController],
})
export class UserModule {}
