import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { parse as parseUUID } from 'uuid';


@Injectable()
export class OwnershipMiddleware implements NestMiddleware {
    constructor(private readonly eventService: EventService) { }

    async use(req, res, next) {
        const eventId  = parseUUID(req.params.id);
        const userId = parseUUID(req.user.id);

        const isOwner = await this.eventService.isOwner(eventId, userId);
        console.log({isOwner})
        if (!isOwner) {
            throw new UnauthorizedException('You are not the owner of this event');
        }

        next();
    }
}
