// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('content')
export class Content {
  @Get('health') health(){ return { status: 'ok' }; }
}
