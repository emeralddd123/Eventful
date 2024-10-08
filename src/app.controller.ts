import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import * as QRCode from 'qrcode'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Redirect('/api', 301)
  root() {
    return { message: 'This is NestJs Application' }
  }

  @Get('generateQr')
  async generate(@Query('url') url: string){
    const qrCodeImage = await QRCode.toDataURL(url || 'https://example.com');
    return(`<img src="${qrCodeImage}" alt="QR Code"/>`);
  }
}
