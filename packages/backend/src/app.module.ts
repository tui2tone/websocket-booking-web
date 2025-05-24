import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { BookingModule } from './booking/booking.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { BedsModule } from './beds/beds.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoomsModule,
    BookingModule,
    SupabaseModule,
    BedsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
