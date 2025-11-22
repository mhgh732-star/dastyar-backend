// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('progress')
export class Progress {
  @Get('health') health(){ return { status: 'ok' }; }
}
