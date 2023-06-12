import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '@config/prisma.service';
import { ProductService } from '@product/product.service';

@Module({
    providers: [CartService, PrismaService, ProductService],
    controllers: [CartController],
})
export class CartModule {}
