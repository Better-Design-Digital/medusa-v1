import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ProductStatus } from '@medusajs/medusa';

export class UpdateProductValidator {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: ProductStatus;

}
