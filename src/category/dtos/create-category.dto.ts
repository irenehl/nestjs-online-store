import * as Joi from 'joi';

export const CategoryDtoSchema = Joi.object({
    name: Joi.string().required(),
});

export class CreateCategoryDto {
    name: string;
}
