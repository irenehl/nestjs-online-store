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
import { AddProductToCartDto } from './dtos/add-product.dto';
import { CartDto } from './dtos/cart.dto';
import { User } from '@user/decorators/user.decorator';
import { PayloadDto } from '@auth/dtos/payload.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@auth/decorators/role.decorator';

@ApiTags('Cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('CLIENT')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    async findOne(@User() user: PayloadDto) {
        return this.cartService.findOne(user.sub);
    }

    @Post()
    async addProduct(
        @User() user: PayloadDto,
        @Body() data: AddProductToCartDto
    ): Promise<CartDto> {
        return this.cartService.addProduct(user.sub, data);
    }

    @Delete(':sku')
    async deleteProductOnCart(
        @User() user: PayloadDto,
        @Param('sku') SKU: string
    ): Promise<CartDto> {
        return this.cartService.deleteProductOnCart(user.sub, Number(SKU));
    }
}
