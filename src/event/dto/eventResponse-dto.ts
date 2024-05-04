import { Expose } from 'class-transformer';
import {CreatorDto} from './creator-dto';

export class EventResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    location: string;

    @Expose()
    type: string;

    @Expose()
    startDate: Date;

    @Expose()
    endDate: Date;

    @Expose()
    remindAt: Date;

    @Expose()
    creator: CreatorDto;
}
