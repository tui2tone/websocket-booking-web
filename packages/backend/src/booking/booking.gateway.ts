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
  QueueStatus,
  SelectBookingQueueDto,
  ValidateMyQueueDto,
  ViewBookingQueueDto,
} from './dto/booking.dto';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { BookingService } from './booking.service';

const maxQueueInRoom = 2;
@WebSocketGateway()
export class BookingGateway {
  @WebSocketServer() server: Server;

  constructor(
    private service: BookingService,
    private auth: AuthService,
  ) {}

  @SubscribeMessage('validateMyQueue')
  async validateMyQueue(
    @MessageBody() dto: ValidateMyQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    return {
      totalQueue: 0,
      waitQueue: 0,
    }
  }

  @SubscribeMessage('subscribeToBookingQueue')
  async joinBookingQueue(
    @MessageBody() dto: JoinBookingQueueDto,
    @ConnectedSocket() client: Socket,
  ) {
    const queue = await this.service.joinBookingQueue(this.server, dto.roomId, dto.token);

    const totalQueue = queue.totalQueue - maxQueueInRoom <= 0 ? 0 : queue.totalQueue - maxQueueInRoom;
    const waitQueue = queue.queue_no - maxQueueInRoom <= 0 ? 0 : queue.queue_no - maxQueueInRoom
    
    return {
      totalQueue,
      waitQueue,
      status: waitQueue <= 0 ? QueueStatus.OnGoing : QueueStatus.Waiting
    }
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
