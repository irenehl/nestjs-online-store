export class ProductDto {
    SKU: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string | null;
    imageUrl?: string | null;
    available: boolean;
    category?: string | null;
}
