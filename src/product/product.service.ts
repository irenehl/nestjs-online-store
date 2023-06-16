import { PrismaService } from '@config/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dtos/product.dto';
import { IPagination } from '@common/interfaces/pagination.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { S3Service } from 'src/aws/s3.service';
import { CategoryService } from 'src/category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private s3: S3Service,
        private categoryService: CategoryService
    ) {}

    // TODO: Improve implementation
    async create(
        data: CreateProductDto,
        image?: Express.Multer.File
    ): Promise<ProductDto> {
        const { name } = await this.categoryService.findOne({
            name: data.category,
        });

        if (!image)
            return ProductDto.toDto(
                await this.prisma.product.create({
                    data: {
                        ...data,
                        stock: Number(data.stock),
                        price: Number(data.price),
                        category: {
                            connect: {
                                name,
                            },
                        },
                    },
                    include: {
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                })
            );

        const product = await this.prisma.product.create({
            data: {
                ...data,
                stock: Number(data.stock),
                price: Number(data.price),
                category: {
                    connect: {
                        name,
                    },
                },
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const { fileName, url } = await this.s3.uploadFile(image);

        return ProductDto.toDto(
            await this.prisma.product.update({
                where: { SKU: product.SKU },
                data: {
                    image: fileName,
                    imageUrl: url,
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
        );
    }

    async findOne(where: Prisma.ProductWhereUniqueInput): Promise<ProductDto> {
        const product = await this.prisma.product
            .findUniqueOrThrow({
                where,
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
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

        const products = await this.prisma.product.findMany({
            skip: Number(page) - 1,
            take: Number(limit),
            cursor,
            where,
            orderBy,
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map(ProductDto.toDto);
    }

    async getProductByCategory(categoryId: number): Promise<ProductDto[]> {
        const products = await this.prisma.product.findMany({
            where: {
                categoryId,
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return products.map(ProductDto.toDto);
    }

    // TODO: Improve implementation, fix when update image
    async update(
        SKU: number,
        data: Partial<UpdateProductDto>,
        image?: Express.Multer.File
    ): Promise<ProductDto> {
        const product = await this.findOne({ SKU });

        if (image) {
            const { fileName, url } = await this.s3.replaceFile(
                image,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                product.image!
            );
        }

        const { name } = await this.categoryService.findOne({
            name: data.category,
        });

        return await this.prisma.product.update({
            data: {
                ...data,
                category: {
                    connect: {
                        name,
                    },
                },
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
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
        );
    }

    async likeProduct(userId: number, SKU: number) {
        const _ = await this.findOne({ SKU });

        const isLiked = await this.prisma.likesOnProducts.findUnique({
            where: {
                userId_productSKU: {
                    userId,
                    productSKU: SKU,
                },
            },
        });

        return isLiked
            ? await this.prisma.likesOnProducts.delete({
                  where: {
                      userId_productSKU: {
                          userId,
                          productSKU: SKU,
                      },
                  },
              })
            : await this.prisma.likesOnProducts.create({
                  data: {
                      user: {
                          connect: {
                              id: userId,
                          },
                      },
                      product: {
                          connect: {
                              SKU,
                          },
                      },
                  },
              });
    }

    async delete(SKU: number): Promise<ProductDto> {
        const _ = await this.findOne({ SKU });

        return ProductDto.toDto(
            await this.prisma.product.delete({
                where: {
                    SKU,
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
        );
    }
}
