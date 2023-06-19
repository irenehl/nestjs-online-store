import * as Joi from 'joi';

export const LoginDtoSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export class LoginDto {
    email: string;
    password: string;
}
