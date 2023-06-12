import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '@config/prisma.service';

@Module({
    providers: [ProductService, PrismaService],
    controllers: [ProductController],
})
export class ProductModule {}
