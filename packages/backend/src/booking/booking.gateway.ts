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

  async broadcastCurentView(roomId: number) {
    const currentView = await this.service.getCurrentViewByRoom(roomId);

    this.server.emit('updateCurrentBookingView', {
      roomId,
      currentView,
    });
  }

  @SubscribeMessage('subscribeToBookingQueue')
  async joinBookingQueue(
    @MessageBody() dto: JoinBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.joinBookingQueue(dto.roomId, dto.token)
    await this.broadcastCurentView(dto.roomId);
  }

  @SubscribeMessage('unsubscribeToBookingQueue')
  async leftBookingQueue(
    @MessageBody() dto: JoinBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.service.leftBookingQueue(dto.roomId, dto.token)
    await this.broadcastCurentView(dto.roomId);
  }

  @SubscribeMessage('select_queue')
  async selectBookingQueue(
    @MessageBody() dto: SelectBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to room sockets
    // User can select or booked only 1 bed for one room
    // Make bed locked, other user can't select
  }

  @SubscribeMessage('booking')
  async bookingBed(@MessageBody() dto: SelectBookingQueueDto) {
    // Check for select queue that user is selected
    // Make bed status booked
  }
  
}
