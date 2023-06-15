import { PrismaService } from '@config/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { IPagination } from '@common/interfaces/pagination.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { S3Service } from 'src/aws/s3.service';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService, private s3: S3Service) {}

    async create(
        data: Prisma.ProductCreateInput,
        image?: Express.Multer.File
    ): Promise<ProductDto> {
        if (!image)
            return await this.prisma.product.create({
                data: {
                    ...data,
                    stock: Number(data.stock),
                    price: Number(data.price),
                },
            });

        const product = await this.prisma.product.create({
            data: {
                ...data,
                stock: Number(data.stock),
                price: Number(data.price),
            },
        });

        const { fileName, url } = await this.s3.uploadFile(image);

        return this.prisma.product.update({
            where: { SKU: product.SKU },
            data: {
                image: fileName,
                imageUrl: url,
            },
        });
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
        data: Prisma.ProductUpdateInput,
        image?: Express.Multer.File
    ): Promise<UpdateProductDto> {
        const product = await this.findOne({ SKU });

        if (image) {
            const { fileName, url } = await this.s3.replaceFile(
                image,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                product.image!
            );

            data.image = fileName;
            data.imageUrl = url;
        }

        return await this.prisma.product.update({ data, where: { SKU } });
    }

    async isAvailable(SKU: number, amount: number): Promise<boolean> {
        const product = await this.findOne({ SKU });

        return product.stock >= amount;
    }

    async toggle(SKU: number): Promise<ProductDto> {
        const product = await this.findOne({ SKU });

        if (product.available) {
            await this.prisma.productsOnCarts.deleteMany({
                where: {
                    productSKU: product.SKU,
                },
            });
        }

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
