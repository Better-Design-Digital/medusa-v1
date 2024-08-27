import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateProductValidator {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsOptional()
    @IsString({ each: true })
    shipping_options?: string[];
}

