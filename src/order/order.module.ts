import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '@config/prisma.service';
import { ProductService } from '@product/product.service';
import { CartService } from '@cart/cart.service';
import { AwsModule } from 'src/aws/aws.module';

@Module({
    imports: [AwsModule],
    providers: [OrderService, PrismaService, ProductService, CartService],
    controllers: [OrderController],
})
export class OrderModule {}
