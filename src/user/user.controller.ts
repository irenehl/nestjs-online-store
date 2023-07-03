import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Query,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Public } from '@auth/decorators/public.decorator';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Public()
    @Post()
    async create(
        @Body(new ValidationPipe()) data: CreateUserDto
    ): Promise<UserDto> {
        return this.userService.create(data);
    }

    @ApiBearerAuth()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findOne({ id: Number(id) });
    }

    @Public()
    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<UserDto[]> {
        return this.userService.findAll({ page, limit });
    }

    @ApiBearerAuth()
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe()) data: UpdateUserDto
    ): Promise<UserDto> {
        return this.userService.update(Number(id), data);
    }

    @ApiBearerAuth()
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(Number(id));
    }
}
