import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { BookingQueue } from './dto/booking.dto';
import { BedStatus } from 'src/beds/entities/bed.entity';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class BookingService {
  constructor(
    private readonly auth: AuthService,
    private readonly supabase: SupabaseService,
  ) {}

  async joinBookingQueue(server: Server, roomId: number, token: string) {
    const user = await this.auth.findUserByToken(token);
    const myQueue = await this.getMyQueue(user.id);
    const nextQueueNo = await this.getNextQueueNoByRoom(roomId);
    if (myQueue) {
      if (roomId != myQueue.room_id) {
        await this.supabase
          .getSupabaseClient()
          .from('booking_queue')
          .update({
            room_id: roomId,
            queue_no: nextQueueNo,
          })
          .eq('user_id', user.id);
      }
    } else {
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .insert({
          user_id: user.id,
          room_id: roomId,
          queue_no: nextQueueNo,
        } as BookingQueue);
    }

    await this.broadcastQueueChanged(server, roomId);
    await this.broadcastCurentView(server, roomId);
    await this.broadcastBedStatus(server, roomId, token);

    return await this.getMyQueue(user.id);
  }

  async recheckMyBookingQueue(server: Server, roomId: number, token: string) {
    const user = await this.auth.findUserByToken(token);
    return await this.getMyQueue(user.id);
  }

  async leftBookingQueue(server: Server, roomId: number, token: string) {
    const user = await this.auth.findUserByToken(token);
    const myQueue = await this.getMyQueue(user.id);
    if (myQueue) {
      // Remove this records
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .delete()
        .eq('user_id', user.id);

      await this.moveQueue(roomId, myQueue.queue_no);
    }
    await this.broadcastCurentView(server, roomId);
    await this.broadcastBedStatus(server, roomId, token);
    await this.broadcastQueueChanged(server, roomId);
  }

  async moveQueue(roomId: number, fromQueueNo: number) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select()
      .eq('room_id', roomId)
      .gte('queue_no', fromQueueNo);

    for (let i = 0; i < queue?.data?.length; i++) {
      const q = queue?.data[i];

      const result = await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .update({
          queue_no: q.queue_no - 1,
        })
        .eq('user_id', q.user_id)
        .eq('room_id', q.room_id);
    }
  }

  async getMyQueue(userId: number) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select()
      .eq('user_id', userId)
      .single();

    if (queue?.data) {
      const totalQueue = await this.getCurrentViewByRoom(queue.data.room_id);
      queue.data.totalQueue = totalQueue || 0;
      return queue?.data;
    }
    return null;
  }

  async createQueue({ userId, roomId }: { userId: number; roomId: number }) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select()
      .eq('user_id', userId)
      .single();
  }

  async getCurrentViewByRoom(roomId: number) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    return queue?.count || 0;
  }

  async getNextQueueNoByRoom(roomId: number) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select()
      .eq('room_id', roomId);

    if (queue.data?.length === 0) {
      return 1;
    }

    return (
      (Math.max(...(queue.data || []).map((o) => o.queue_no || 0)) || 0) + 1
    );
  }

  async lockBedQueue(
    server: Server,
    roomId: number,
    bedId: number,
    token: string,
  ) {
    const user = await this.auth.findUserByToken(token);
    // Check if this bed is available for booking
    const available = await this.checkBedAvailability(roomId, bedId, user.id);
    if (!available) {
      return false;
    }
    const myQueue = await this.getMyRoomQueue(user.id, roomId);
    if (myQueue) {
      // Update BedID
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .update({
          bed_id: bedId,
        })
        .eq('user_id', user.id);

      // Release Other Flag
      if (myQueue.bed_id) {
        await this.supabase
          .getSupabaseClient()
          .from('beds')
          .update({
            status: BedStatus.Available,
            locked_user_id: null,
          })
          .eq('id', myQueue.bed_id)
          .eq('status', BedStatus.Locked)
          .eq('locked_user_id', user.id);
      }

      // Lock Flag to Bed
      const result = await this.supabase
        .getSupabaseClient()
        .from('beds')
        .update({
          status: BedStatus.Locked,
          locked_user_id: user.id,
        })
        .eq('id', bedId)
        .eq('status', BedStatus.Available)
        .is('locked_user_id', null);
    }
    await this.broadcastBedStatus(server, roomId, token);
  }

  async finishBookingQueue(
    server: Server,
    roomId: number,
    bedId: number,
    token: string,
  ) {
    const user = await this.auth.findUserByToken(token);
    // Check if this bed is available for booking
    const available = await this.checkBedLockedQueue(roomId, bedId, user.id);
    if (!available) {
      return false;
    }
    const myQueue = await this.getMyRoomQueue(user.id, roomId);
    if (myQueue) {
      // Update BedID
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .update({
          bed_id: null,
        })
        .eq('user_id', user.id);

      // Booked Flag to Bed
      const result = await this.supabase
        .getSupabaseClient()
        .from('beds')
        .update({
          status: BedStatus.Booked,
        })
        .eq('id', bedId)
        .eq('status', BedStatus.Locked)
        .eq('locked_user_id', user.id);

      // Booked Flag to Bed
      await this.supabase.getSupabaseClient().from('booking_history').insert({
        user_id: user.id,
        bed_id: bedId,
        room_id: roomId,
      });
    }
    await this.broadcastBedStatus(server, roomId, token);
  }

  async cancelBedQueue(server: Server, roomId: number, token: string) {
    const user = await this.auth.findUserByToken(token);
    const myQueue = await this.getMyRoomQueue(user.id, roomId);
    if (myQueue) {
      // Update BedID
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .update({
          bed_id: null,
        })
        .eq('user_id', user.id);

      // Release Lock Flag
      const result = await this.supabase
        .getSupabaseClient()
        .from('beds')
        .update({
          status: BedStatus.Available,
          locked_user_id: null,
        })
        .eq('id', myQueue.bed_id)
        .eq('status', BedStatus.Locked)
        .eq('locked_user_id', user.id);
    }
    await this.broadcastBedStatus(server, roomId, token);
  }

  async getMyRoomQueue(userId: number, roomId: number) {
    const queue = await this.supabase
      .getSupabaseClient()
      .from('booking_queue')
      .select()
      .eq('user_id', userId)
      .eq('room_id', roomId)
      .single();

    if (queue?.data) {
      return queue?.data;
    }
    return null;
  }

  async getBedsInRooms(roomId: number, token: string) {
    const user = await this.auth.findUserByToken(token);
    const beds = await this.supabase
      .getSupabaseClient()
      .from('beds')
      .select()
      .eq('room_id', roomId);

    return beds?.data || [];
  }

  async broadcastCurentView(server: Server, roomId: number) {
    const currentView = await this.getCurrentViewByRoom(roomId);

    server.emit('updateCurrentBookingView', {
      roomId,
      currentView,
    });
  }

  async broadcastBedStatus(server: Server, roomId: number, token: string) {
    const beds = await this.getBedsInRooms(roomId, token);

    for (let bed of beds) {
      server.emit('updateCurrentBedStatus', {
        roomId,
        bedId: bed.id,
        status: bed.status,
        lockedUserId: bed.locked_user_id,
      });
    }
  }

  async checkBedAvailability(roomId: number, bedId: number, userId: number) {
    const bed = await this.supabase
      .getSupabaseClient()
      .from('beds')
      .select()
      .eq('room_id', roomId)
      .eq('id', bedId)
      .single();

    if (
      bed.data.status === BedStatus.Available ||
      (bed.data.status === BedStatus.Locked &&
        bed.data.locked_user_id === userId)
    ) {
      return true;
    }

    return false;
  }

  async checkBedLockedQueue(roomId: number, bedId: number, userId: number) {
    const bed = await this.supabase
      .getSupabaseClient()
      .from('beds')
      .select()
      .eq('room_id', roomId)
      .eq('id', bedId)
      .single();

    if (
      bed.data.status === BedStatus.Locked &&
      bed.data.locked_user_id === userId
    ) {
      return true;
    }

    return false;
  }

  async broadcastQueueChanged(server: Server, roomId: number) {
    server.emit('onQueueChanged', {
      roomId
    });
  }
}
