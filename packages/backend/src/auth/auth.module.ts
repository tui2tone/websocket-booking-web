import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SupabaseModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}
