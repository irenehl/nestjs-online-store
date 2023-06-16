import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dtos/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async create(
        @Body() data: CreateProductDto,
        @UploadedFile() image: Express.Multer.File
    ): Promise<ProductDto> {
        return this.productService.create(data, image);
    }

    @Get(':sku')
    async findOne(@Param('sku') sku: string): Promise<ProductDto | null> {
        return this.productService.findOne({ SKU: Number(sku) });
    }

    @Get('category/:id')
    async getProductsByCategory(
        @Param('id') id: string
    ): Promise<ProductDto[]> {
        return this.productService.getProductByCategory(Number(id));
    }

    @Get('')
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<ProductDto[]> {
        return this.productService.findAll({ page, limit });
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':sku')
    async update(
        @Body() data: UpdateProductDto,
        @Param('sku') sku: string,
        @UploadedFile() image: Express.Multer.File
    ): Promise<Partial<ProductDto>> {
        return this.productService.update(Number(sku), data, image);
    }

    @Patch('toggle/:sku')
    async toggle(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.toggle(Number(sku));
    }

    @Delete(':sku')
    async delete(@Param('sku') sku: string): Promise<ProductDto> {
        return this.productService.delete(Number(sku));
    }
}
