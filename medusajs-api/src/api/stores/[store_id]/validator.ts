import { IsString } from 'class-validator';

export class GetStoreParams {
    @IsString()
    store_id: string;
}
