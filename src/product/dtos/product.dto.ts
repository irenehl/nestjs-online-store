import { Product } from '@prisma/client';

export class ProductDto {
    SKU: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string | null;
    available: boolean;
    category: string;

    static toDto(product: Product): ProductDto {
        return {
            SKU: product.SKU,
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
