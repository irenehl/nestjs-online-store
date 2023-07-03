import { ProductOnCartDto } from '@cart/dtos/product-on-cart.dto';

export class OrderDto {
    id: number;
    userId: number;
    total: number;

    items: ProductOnCartDto[];
}
