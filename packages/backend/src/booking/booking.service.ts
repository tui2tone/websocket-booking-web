import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { BookingQueue } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly auth: AuthService,
    private readonly supabase: SupabaseService,
  ) {}

  async joinBookingQueue(roomId, token) {
    const user = await this.auth.findUserByToken(token);
    const myQueue = await this.getMyQueue(user.id);
    if (myQueue) {
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .update({
          room_id: roomId,
        })
        .eq('user_id', user.id);
    } else {
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .insert({
          user_id: user.id,
          room_id: roomId,
        } as BookingQueue);
    }
  }

  async leftBookingQueue(roomId, token) {
    const user = await this.auth.findUserByToken(token);
    const myQueue = await this.getMyQueue(user.id);
    if (myQueue) {
      // Remove this records
      await this.supabase
        .getSupabaseClient()
        .from('booking_queue')
        .delete()
        .eq('user_id', user.id);
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
}
