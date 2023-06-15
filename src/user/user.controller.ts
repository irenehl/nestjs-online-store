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

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async create(@Body() data: CreateUserDto): Promise<UserDto> {
        return this.userService.create(data);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findOne({ id: Number(id) });
    }

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<UserDto[]> {
        return this.userService.findAll({ page, limit });
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() data: Partial<UserDto>
    ): Promise<UserDto> {
        return this.userService.update(Number(id), data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<UserDto> {
        return this.userService.delete(Number(id));
    }
}
