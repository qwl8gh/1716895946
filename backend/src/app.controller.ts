import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get('api/leads')
  async getLeadsData(@Query('query') query?: string) {
    if (query) {
      return this.appService.getFilteredData(query);
    } else {
      return this.appService.getAllData();
    }
  }
}
