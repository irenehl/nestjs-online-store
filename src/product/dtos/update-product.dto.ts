import { Product } from '@prisma/client';

export class UpdateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    available: boolean;
    category: string;

    static toDto(product: Product): UpdateProductDto {
        return {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            available: product.available,
            category: product.category,
        };
    }
}
