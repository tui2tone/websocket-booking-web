import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { async } from 'rxjs';
import {
  JoinBookingQueueDto,
  SelectBookingQueueDto,
  ViewBookingQueueDto,
} from './dto/booking.dto';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BookingService } from './booking.service';

@WebSocketGateway()
export class BookingGateway {
  @WebSocketServer() server: Server;

  constructor(
    private service: BookingService,
    private auth: AuthService,
  ) {}

  @SubscribeMessage('subscribeToBookingQueue')
  async joinBookingQueue(
    @MessageBody() dto: JoinBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.joinBookingQueue(this.server, dto.roomId, dto.token);
  }

  @SubscribeMessage('unsubscribeToBookingQueue')
  async leftBookingQueue(
    @MessageBody() dto: JoinBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.leftBookingQueue(this.server, dto.roomId, dto.token);
  }

  @SubscribeMessage('lockBedQueue')
  async lockBookingQueue(
    @MessageBody() dto: SelectBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.lockBedQueue(this.server, dto.roomId, dto.bedId, dto.token);
  }

  @SubscribeMessage('finishBedQueue')
  async finishBookingQueue(
    @MessageBody() dto: SelectBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.finishBookingQueue(this.server, dto.roomId, dto.bedId, dto.token);
  }

  @SubscribeMessage('cancelBedQueue')
  async cancelBookingQueue(
    @MessageBody() dto: SelectBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.cancelBedQueue(this.server, dto.roomId, dto.token);
  }

  @SubscribeMessage('booking')
  async bookingBed(@MessageBody() dto: SelectBookingQueueDto) {
    // Check for select queue that user is selected
    // Make bed status booked
    await this.service.lockBedQueue(this.server, dto.roomId, dto.bedId, dto.token);
  }
}
