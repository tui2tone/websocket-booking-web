import { Module } from '@nestjs/common';
import { BedsController } from './beds.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule
  ],
  controllers: [BedsController]
})
export class BedsModule {}
