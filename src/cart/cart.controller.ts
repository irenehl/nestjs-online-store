import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AddProductDto } from './dtos/add-product.dto';
import { CartDto } from './dtos/cart.dto';
import { User } from '@user/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    async findAllProductsOnCart(@Param('id') id: string) {
        return this.cartService.findAllProductsOnCart(Number(id));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.cartService.findOne(Number(id));
    }

    @Post()
    async addProduct(
        @User() id: any,
        @Body() data: AddProductDto
    ): Promise<CartDto> {
        return this.cartService.addProduct(Number(id), data);
    }

    @Delete()
    async deleteProductOnCart(
        @Param('id') id: string,
        @Param('productId') prodcutId: string
    ) {
        return this.cartService.removeProduct(Number(id), Number(prodcutId));
    }
}
