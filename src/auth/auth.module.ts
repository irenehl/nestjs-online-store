import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserService } from '@user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@config/prisma.service';

@Module({
    imports: [UserModule, PassportModule, JwtModule],
    providers: [
        AuthService,
        LocalStrategy,
        UserService,
        ConfigService,
        PrismaService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
