import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { SupabaseService } from 'src/supabase/supabase.service';

const tableName = 'rooms';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly supabase: SupabaseService) {}
  @Get()
  async getRooms(@Query() search: string): Promise<{
    data: Room[];
  }> {
    const result = await this.supabase
      .getSupabaseClient()
      .from(tableName)
      .select();
    return {
      data: result.data as Room[],
    };
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string): Promise<Room> {
    const result = await this.supabase
      .getSupabaseClient()
      .from(tableName)
      .select()
      .eq('id', id)

    if (result.data?.length === 0) {
      throw new NotFoundException('Room not found');
    }

    return result.data[0] as Room;
  }
}
