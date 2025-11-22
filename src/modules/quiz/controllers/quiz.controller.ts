// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('quiz')
export class Quiz {
  @Get('health') health(){ return { status: 'ok' }; }
}
