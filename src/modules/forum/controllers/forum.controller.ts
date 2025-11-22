// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('forum')
export class Forum {
  @Get('health') health(){ return { status: 'ok' }; }
}
