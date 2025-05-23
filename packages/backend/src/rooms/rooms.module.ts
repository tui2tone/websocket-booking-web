import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule
  ],
  controllers: [RoomsController]
})
export class RoomsModule {}
