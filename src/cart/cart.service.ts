import { PrismaService } from '@config/prisma.service';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AddProductDto } from './dtos/add-product.dto';
import { CartDto } from './dtos/cart.dto';
import { ProductService } from '@product/product.service';

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productService: ProductService
    ) {}

    async findOne(userId: number) {
        return this.prisma.cart
            .findFirstOrThrow({ where: { userId } })
            .catch(() => {
                throw new NotFoundException('Cart not found');
            });
    }

    async findAllProductsOnCart(cartId: number) {
        return this.prisma.productsOnCarts.findMany({ where: { cartId } });
    }

    async addProduct(userId: number, data: AddProductDto): Promise<CartDto> {
        if (!(await this.productService.isAvailable(data.SKU, data.quantity)))
            throw new BadRequestException('Quantity exceeds current stock');

        const cart = await this.findOne(userId);

        const pd = await this.prisma.productsOnCarts.upsert({
            where: {
                cartId_productSKU: {
                    cartId: cart.id,
                    productSKU: data.SKU,
                },
            },
            create: {
                productSKU: data.SKU,
                quantity: data.quantity,
                cartId: cart.id,
            },
            update: {
                quantity: data.quantity,
            },
        });

        return CartDto.toDto(cart, [
            ...(await this.findAllProductsOnCart(cart.id)),
            pd,
        ]);
    }

    async removeProduct(userId: number, SKU: number) {
        const cart = await this.findOne(userId);

        const _ = await this.prisma.productsOnCarts
            .findUniqueOrThrow({
                where: {
                    cartId_productSKU: {
                        productSKU: SKU,
                        cartId: cart.id,
                    },
                },
            })
            .catch(() => {
                throw new NotFoundException(
                    `Product ${SKU} is not in this cart`
                );
            });

        await this.prisma.productsOnCarts.delete({
            where: {
                cartId_productSKU: {
                    productSKU: SKU,
                    cartId: cart.id,
                },
            },
        });

        return CartDto.toDto(cart, await this.findAllProductsOnCart(cart.id));
    }
}
