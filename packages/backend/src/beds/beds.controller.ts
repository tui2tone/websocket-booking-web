import { Controller, Get, Query } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Bed } from './entities/bed.entity';

const tableName = 'beds';

@Controller('beds')
export class BedsController {
  constructor(private readonly supabase: SupabaseService) {}
  @Get()
  async getRooms(@Query('roomId') roomId: number): Promise<{
    data: Bed[];
  }> {
    const result = await this.supabase
      .getSupabaseClient()
      .from(tableName)
      .select()
      .eq('room_id', roomId)
      .order('bed_no', {
        ascending: true
      })
    return {
      data: result.data as Bed[],
    };
  }
}
