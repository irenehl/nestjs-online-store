import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDto } from '@user/dtos/user.dto';
import { TokenDto } from './dtos/token.dto';
import { AuthService } from './auth.service';
import { User } from '@user/decorators/user.decorator';
import { RequestPasswordDto } from '@user/dtos/request-password.dto';
import { ResetPasswordDto } from '@user/dtos/reset-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({
        type: LoginDto,
    })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: UserDto): Promise<TokenDto> {
        return this.authService.login(user);
    }

    @Post('reset')
    async resetRequest(
        @Body(new ValidationPipe()) body: RequestPasswordDto
    ): Promise<UserDto> {
        return this.authService.resetRequest(body);
    }

    @Post('reset/:token')
    async resetHandler(
        @Body(new ValidationPipe()) body: ResetPasswordDto,
        @Param('token') token: string
    ): Promise<UserDto> {
        return this.authService.resetHandler(body, token);
    }
}
