import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Query,
    Patch,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/')
    async create(@Body() data: CreateUserDto): Promise<UserDto> {
        return this.userService.create(data);
    }

    @Get('/:id')
    async getUser(@Param('id') id: string): Promise<UserDto> {
        return this.userService.findOne({ id: Number(id) });
    }

    @Get('/')
    async getAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<UserDto[]> {
        return this.userService.findAll({ page, limit });
    }

    @Patch('/:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateUserDto
    ): Promise<UpdateUserDto> {
        return this.userService.update(Number(id), data);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string): Promise<UserDto> {
        return this.userService.delete(Number(id));
    }
}
