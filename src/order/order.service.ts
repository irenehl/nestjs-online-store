import { IPagination } from '@common/interfaces/pagination.dto';
import { PrismaService } from '@config/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductService } from '@product/product.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private productService: ProductService
    ) {}

    async findOne(where: Prisma.OrderWhereUniqueInput) {
        return this.prisma.order.findUnique({ where });
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.OrderWhereUniqueInput;
            where?: Prisma.OrderWhereInput;
            orderBy?: Prisma.UserOrderByWithAggregationInput;
        }
    ) {
        const { page, limit, cursor, where, orderBy } = params;
        return this.prisma.order.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }
}
