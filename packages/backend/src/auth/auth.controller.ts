import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly service: AuthService,
    private readonly supabase: SupabaseService
  ) {}
  @Get()
  async authen(@Headers('Authorization') authToken: string) {
    try {
      const existUser = await this.service.findUserByToken(authToken);

      await this.supabase
        .getSupabaseClient()
        .from('users')
        .insert({
          uuid: authToken,
          email: faker.internet.email(),
        } as User)

      const createdUser = await this.service.findUserByToken(authToken);
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
