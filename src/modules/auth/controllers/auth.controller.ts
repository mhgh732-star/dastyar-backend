// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class Auth {
  @Get('health') health(){ return { status: 'ok' }; }
}
