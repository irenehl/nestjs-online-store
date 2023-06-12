import { Cart, ProductsOnCarts } from '@prisma/client';
import { ProductOnCartDto } from './product-on-cart.dto';

export class CartDto {
    id: number;
    userId: number;

    products: ProductOnCartDto[];

    static toDto(cart: Cart, products: ProductsOnCarts[]): CartDto {
        return {
            ...cart,
            products: products.map(({ productSKU: SKU, quantity }) => ({
                SKU,
                quantity,
            })),
        };
    }
}
