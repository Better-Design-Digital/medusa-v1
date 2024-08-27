import { IsOptional, IsString } from 'class-validator';

export class GetStoresQuery {
    @IsOptional()
    @IsString()
    q?: string;
}
