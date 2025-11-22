// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class App {
  @Get('health') health(){ return { status: 'ok' }; }
}
