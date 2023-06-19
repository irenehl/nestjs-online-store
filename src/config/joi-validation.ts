import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe {
    constructor(private schema: any) {
        this.schema = schema;
    }

    transform(value: any) {
        const { error } = this.schema.validate(value);

        if (error) {
            throw new BadRequestException(error.message);
        }
        return value;
    }
}
