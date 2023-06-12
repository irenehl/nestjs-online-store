import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    async findOne(@Param('id') id: string) {
        return this.cartService.findOne(Number(id));
    }

    @Get()
    async findAllProductsOnCart(@Param('id') id: string) {
        return this.cartService.findAllProductsOnCart(Number(id));
    }
}
