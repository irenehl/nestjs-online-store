import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '@user/dtos/user.dto';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenDto } from './dtos/token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(
        email: string,
        password: string
    ): Promise<UserDto | false> {
        const user = (await this.userService.findOne({ email }, false)) as User;

        if (!(await bcrypt.compare(password, user.password))) return false;

        return user;
    }

    async login(dto: UserDto): Promise<TokenDto> {
        const payload = { email: dto.email, sub: dto.id, role: dto.role };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }
}
