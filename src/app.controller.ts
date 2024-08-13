import { Controller, Get, Post, Query, Redirect, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import * as QRCode from 'qrcode'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Redirect('/api', 301)
  root() {
    return { message: 'This is NestJs Application' }
  }

  @Get('generateQr')
  async generate(@Query('url') url: string) {
    const qrCodeImage = await QRCode.toDataURL(url || 'https://example.com');
    return (`<img src="${qrCodeImage}" alt="QR Code"/>`);
  }

  @Post('upload')

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

}
