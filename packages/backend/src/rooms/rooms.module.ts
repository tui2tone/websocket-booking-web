import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { RoomsGateway } from './rooms.gateway';

@Module({
  imports: [
    SupabaseModule
  ],
  controllers: [RoomsController],
  providers: [RoomsGateway]
})
export class RoomsModule {}
