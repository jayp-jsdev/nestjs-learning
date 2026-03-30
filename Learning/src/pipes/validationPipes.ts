import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod/v3';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return result.data;
  }
}
