import { Module } from '@nestjs/common';
import { BookingGateway } from './booking.gateway';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { BookingService } from './booking.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [],
  providers: [BookingGateway, BookingService],
})
export class BookingModule {}
