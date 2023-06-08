import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from '@user/dtos/user.dto';
import { TokenDto } from './dtos/token.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @UseGuards(LocalAuthGuard)
    // @Post('/login')
    // async login(
    //     @Request() req: LoginDto & { user: UserDto }
    // ): Promise<TokenDto> {
    //     return this.authService.login(req.user);
    // }
}
