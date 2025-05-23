import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(private readonly configService: ConfigService) {}

  getSupabaseClient() {
    const url = this.configService.get('SUPABASE_URL');
    const key = this.configService.get('SUPABASE_KEY');

    return createClient(url, key);
  }
}
