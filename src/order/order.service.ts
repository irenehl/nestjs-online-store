import { IPagination } from '@common/interfaces/pagination.dto';
import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CartService } from '@cart/cart.service';
import { OrderDto } from './dtos/order.dto';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService
    ) {}

    async findOne(where: Prisma.OrderWhereUniqueInput) {
        return this.prisma.order.findUniqueOrThrow({ where }).catch(() => {
            throw new NotFoundException('Order not found');
        });
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

    async placeOrder(userId: number) {
        return await this.prisma.$transaction(async (tx) => {
            const cart = await tx.cart
                .findFirstOrThrow({
                    where: { userId },
                    include: {
                        products: {
                            select: {
                                product: true,
                                quantity: true,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new NotFoundException('Cart not found');
                });

            const order = await tx.order.create({
                data: {
                    userId,
                },
            });

            let totalAmount = 0;

            await Promise.all(
                cart.products.map(async ({ product, quantity }) => {
                    const updatedProduct = await tx.product.update({
                        where: { SKU: product.SKU },
                        data: {
                            stock: {
                                decrement: quantity,
                            },
                        },
                    });

                    if (updatedProduct.stock < 0)
                        throw new BadRequestException(
                            `Quantity (${quantity}) of product with SKU: ${product.SKU} exceeds current stock (${product.stock})`
                        );

                    await tx.productsOnOrders.create({
                        data: {
                            productSKU: product.SKU,
                            orderId: order.id,
                            quantity,
                        },
                    });

                    await tx.productsOnCarts.delete({
                        where: {
                            cartId_productSKU: {
                                cartId: cart.id,
                                productSKU: product.SKU,
                            },
                        },
                    });

                    totalAmount += product.price * quantity;
                })
            );

            return OrderDto.toDto(
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        total: totalAmount,
                    },
                    include: {
                        products: {
                            select: {
                                product: true,
                                quantity: true,
                            },
                        },
                    },
                })
            );
        });
    }
}
