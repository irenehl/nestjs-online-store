import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dtos/product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post('/')
    async create(@Body() data: ProductDto): Promise<ProductDto> {
        return this.productService.create(data);
    }

    @Get('/:sku')
    async findOne(@Param('sku') sku: string): Promise<ProductDto | null> {
        return this.productService.findOne({ SKU: Number(sku) });
    }

    @Get('/')
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<ProductDto[]> {
        return this.productService.findAll({ page, limit });
    }

    @Patch('/:sku')
    async update(
        @Body() data: UpdateProductDto,
        @Param('sku') sku: string
    ): Promise<UpdateProductDto> {
        return this.productService.update(Number(sku), data);
    }

    @Delete('/:sku')
    async delete(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.delete(Number(sku));
    }
}
