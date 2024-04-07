import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventModel } from "./event.entity";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event-dto";
import { UserService } from "src/users/user.service";
import { UUID } from "crypto";
import { UpdateEventDto } from "./dto/update-event-dto";
import { FetchEventsDto } from "./dto/fetch-events-dto";
import { plainToClass } from "class-transformer";
import { EventResponseDto } from "./dto/eventResponse-dto";
import { CreatorDto } from "./dto/creator-dto";


export interface EventsWithMetadata {
  events: EventResponseDto[];
  metadata: {
    totalCount: number;
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  };
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventModel)
    private readonly eventRepository: Repository<EventModel>,
    private readonly userService: UserService,

  ) { }

  async isOwner(eventId: UUID, userId: UUID): Promise<boolean> {
    const event: EventModel = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!event || !event.creator) {
      return false;
    }

    return event.creator.id === userId;
  }

  async getAll(fetchEventsDto: FetchEventsDto): Promise<EventsWithMetadata> {
    const { limit, offset, startDate, endDate, search, type } = fetchEventsDto;

    let query = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'owner', 'owner.id = event.creatorId');

    if (startDate) {
      query = query.where('event.startDate >= :startDate', { startDate });
    }
    if (endDate) {
      query = query.andWhere('event.endDate <= :endDate', { endDate });
    }
    if (search) {
      query = query.andWhere('(event.name LIKE :search OR event.description LIKE :search)', { search: `%${search}%` });
    }
    if (type) {
      query = query.andWhere('event.type = :type', { type });
    }

    const totalCount = await query.getCount();

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }

    const events = await query.getMany();
    const transformedEvents = events.map(event => {
      const creatorDto = plainToClass(CreatorDto, event.creator);
      const eventDto = plainToClass(EventResponseDto, event, {
        excludeExtraneousValues: true,
        strategy: 'excludeAll',
        enableCircularCheck: true,
      });
      eventDto.creator = creatorDto;
      return eventDto;
    });

    const metadata = {
      totalCount,
      limit,
      offset,
      startDate,
      endDate,
      search
    };

    return { events: transformedEvents, metadata };
  }


  async create(createEventDto: CreateEventDto, userId: UUID): Promise<EventModel> {
    const event = this.eventRepository.create(createEventDto);


    const creator = await this.userService.findOneById(userId)
    if (!creator) {
      throw new Error('Creator user not found');
    }
    event.creator = creator;


    const savedEvent = await this.eventRepository.save(event);
    return savedEvent;
  }

  async findOne(eventId: UUID): Promise<any> {
    const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: ['creator'] })

    const creatorRes = plainToClass(CreatorDto, event.creator)
    const eventResponseDto = plainToClass(EventResponseDto, event, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
      enableCircularCheck: true,
    });
    eventResponseDto.creator = creatorRes
    return eventResponseDto;
  }


  async updateOne(updateEventDto: UpdateEventDto, eventId: UUID): Promise<EventModel> {
    const eventToUpdate: EventModel = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!eventToUpdate) {
      return null;
    }

    Object.assign(eventToUpdate, updateEventDto);

    const updatedEvent: EventModel = await this.eventRepository.save(eventToUpdate);

    return updatedEvent;
  }

  async myCreatedEvents(userId: UUID, fetchEventsDto: FetchEventsDto): Promise<EventsWithMetadata> {
    const { limit, offset, startDate, endDate, search, type } = fetchEventsDto;

    let query = this.eventRepository.createQueryBuilder('event')
      .where('event.creatorId = :userId', { userId });

    if (startDate) {
      query = query.where('event.startDate >= :startDate', { startDate });
    }
    if (endDate) {
      query = query.andWhere('event.endDate <= :endDate', { endDate });
    }
    if (search) {
      query = query.andWhere('(event.name LIKE :search OR event.description LIKE :search)', { search: `%${search}%` });
    }
    if (type) {
      query = query.andWhere('event.type = :type', { type });
    }

    const totalCount = await query.getCount();

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.offset(offset);
    }

    const events = await query.getMany();
    const transformedEvents = events.map(event => {
      const eventDto = plainToClass(EventResponseDto, event, {
        excludeExtraneousValues: true,
        strategy: 'excludeAll',
        enableCircularCheck: true,
      });
      return eventDto;
    });

    const metadata = {
      totalCount,
      limit,
      offset,
      startDate,
      endDate,
      search
    };

    return { events: transformedEvents, metadata };
  }
}
