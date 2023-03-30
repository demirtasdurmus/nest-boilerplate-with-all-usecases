import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../dispatchers/order-created.event';

@Injectable()
export class OrderCreatedListener {
  @OnEvent('order.created', {
    // async: true,
  })
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    console.log('Event emitted:', event.data);
  }
}
