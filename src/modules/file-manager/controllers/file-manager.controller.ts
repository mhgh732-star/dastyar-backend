// Auto-generated skeleton file
import { Controller, Get } from '@nestjs/common';

@Controller('file-manager')
export class File-Manager {
  @Get('health') health(){ return { status: 'ok' }; }
}
