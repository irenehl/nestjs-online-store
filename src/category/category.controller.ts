import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, CategoryDtoSchema } from './dtos/category.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { JoiValidationPipe } from '@config/joi-validation';
import { Role } from '@auth/decorators/role.decorator';
import { RolesGuard } from '@auth/guards/role.guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post()
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @UsePipes(new JoiValidationPipe(CategoryDtoSchema))
    async create(@Body() data: CategoryDto): Promise<CategoryDto> {
        return this.categoryService.create(data);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoryService.findOne({ id: Number(id) });
    }

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<CategoryDto[]> {
        return this.categoryService.findAll({ page, limit });
    }

    @Patch(':id')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    @UsePipes(new JoiValidationPipe(CategoryDtoSchema))
    async update(
        @Param('id') id: string,
        @Body() data: Partial<CategoryDto>
    ): Promise<CategoryDto> {
        return this.categoryService.update({ id: Number(id) }, data);
    }

    @Delete(':id')
    @Role('MANAGER')
    @UseGuards(RolesGuard)
    async delete(@Param('id') id: string): Promise<CategoryDto> {
        return this.categoryService.delete({ id: Number(id) });
    }
}
