import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async findUserByToken(authToken): Promise<User|null> {
    const existUser = await this.supabase
      .getSupabaseClient()
      .from('users')
      .select()
      .eq('uuid', authToken)
      .single();

    if (existUser?.data) {
      return existUser?.data;
    }
    return null;
  }
}
