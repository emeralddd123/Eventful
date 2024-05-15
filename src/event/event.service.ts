import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "./event.entity";
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
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly userService: UserService,
  ) { }

  async isOwner(eventId: UUID, userId: UUID): Promise<boolean> {
    const event: Event = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!event || !event.creator) {
      return false;
    }

    return event.creator.id === userId;
  }

  async findAll(fetchEventsDto: FetchEventsDto): Promise<EventsWithMetadata> {
    try {
      const { limit, offset, startDate, endDate, search, type } = fetchEventsDto;

      let query = this.eventRepository.createQueryBuilder('event')
        .leftJoinAndSelect('event.creator', 'user', 'user.id = event.creatorId');

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
      } else {
        query = query.limit(20);
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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch events');
    }
  }


  async create(createEventDto: CreateEventDto, userId: UUID): Promise<EventResponseDto> {
    if (!createEventDto.remindAt) {
      createEventDto.remindAt = new Date(createEventDto.startDate.getTime() - 12 * 60 * 60 * 1000);
    }
    const event = this.eventRepository.create(createEventDto);


    const creator = await this.userService.findOneById(userId)
    if (!creator) {
      throw new Error('Creator user not found');
    }
    event.creator = creator;


    const savedEvent = await this.eventRepository.save(event);
    const creatorRes = plainToClass(CreatorDto, savedEvent.creator)
    const eventRes = plainToClass(EventResponseDto, savedEvent, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    })
    eventRes.creator = creatorRes
    return eventRes;
  }

  async findOne(eventId: UUID): Promise<any> {
    const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: { creator: true, } })

    const creatorRes = plainToClass(CreatorDto, event.creator)
    const eventResponseDto = plainToClass(EventResponseDto, event, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
      enableCircularCheck: true,
    });
    eventResponseDto.creator = creatorRes
    return eventResponseDto;
  }


  async updateOne(updateEventDto: UpdateEventDto, eventId: string): Promise<Event> {
    const eventToUpdate: Event = await this.eventRepository.findOne({ where: { id: eventId } });

    if (!eventToUpdate) {
      return null;
    }

    Object.assign(eventToUpdate, updateEventDto);

    const updatedEvent: Event = await this.eventRepository.save(eventToUpdate);

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


  async getEventTickets(userId: UUID, eventId: UUID) {
    const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: { tickets: true } });

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }
    if (event.creatorId !== userId) {
      throw new HttpException('Only the event Creator can view the list of tickets', HttpStatus.FORBIDDEN);
    }
    return event;
  }



  async findUnnotifiedEvents() {
    const eightHoursFromNow = new Date();
    eightHoursFromNow.setHours(eightHoursFromNow.getHours() + 8);
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.startDate <= :startDate', { startDate: eightHoursFromNow })
      .andWhere('event.notified = :notified', { notified: false })
      .leftJoinAndSelect('event.tickets', 'ticket')
      .getMany();
    return events
  }
}