import { Category } from '@prisma/client';
import * as Joi from 'joi';

export const CategoryDtoSchema = Joi.object({
    name: Joi.string().required(),
});

export class CategoryDto {
    id: number;
    name: string;

    static toDto(category: CategoryDto): Category {
        return {
            id: category.id,
            name: category.name,
        };
    }
}
