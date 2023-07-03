import { ProductOnCartDto } from './product-on-cart.dto';

export class CartDto {
    id: number;
    userId: number;

    items: ProductOnCartDto[];
}
