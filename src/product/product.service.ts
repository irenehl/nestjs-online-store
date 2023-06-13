import { PrismaService } from '@config/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { IPagination } from '@common/interfaces/pagination.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.ProductCreateInput): Promise<ProductDto> {
        return await this.prisma.product.create({ data });
    }

    async findOne(where: Prisma.ProductWhereUniqueInput): Promise<ProductDto> {
        const product = await this.prisma.product
            .findUniqueOrThrow({ where })
            .catch(() => {
                throw new NotFoundException(`Product ${where.SKU} not found`);
            });

        return ProductDto.toDto(product);
    }

    async findAll(
        params: IPagination & {
            cursor?: Prisma.ProductWhereUniqueInput;
            where?: Prisma.ProductWhereInput;
            orderBy?: Prisma.ProductOrderByWithAggregationInput;
        }
    ): Promise<ProductDto[]> {
        const { page, limit, cursor, where, orderBy } = params;

        return await this.prisma.product.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
        });
    }

    async update(
        SKU: number,
        data: Prisma.ProductUpdateInput
    ): Promise<UpdateProductDto> {
        const _ = await this.findOne({ SKU });

        return await this.prisma.product.update({
            data: {
                ...data,
            },
            where: {
                SKU,
            },
        });
    }

    async isAvailable(SKU: number, amount: number): Promise<boolean> {
        const product = await this.findOne({ SKU });

        return product.stock >= amount;
    }

    async toggle(SKU: number): Promise<ProductDto> {
        const product = await this.findOne({ SKU });

        return ProductDto.toDto(
            await this.prisma.product.update({
                where: { SKU },
                data: {
                    available: !product.available,
                },
            })
        );
    }

    async delete(SKU: number): Promise<ProductDto> {
        const _ = await this.findOne({ SKU });

        return await this.prisma.product.delete({
            where: {
                SKU,
            },
        });
    }
}
