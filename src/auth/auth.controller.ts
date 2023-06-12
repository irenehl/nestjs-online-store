import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDto } from '@user/dtos/user.dto';
import { TokenDto } from './dtos/token.dto';
import { AuthService } from './auth.service';
import { User } from '@user/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: UserDto): Promise<TokenDto> {
        return this.authService.login(user);
    }
}
