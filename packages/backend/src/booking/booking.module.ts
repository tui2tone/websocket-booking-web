import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingGateway } from './booking.gateway';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { BookingService } from './booking.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingGateway, BookingService],
})
export class BookingModule {}
