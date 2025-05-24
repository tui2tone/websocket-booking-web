import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('booking-queue')
  async bookingQueue(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
