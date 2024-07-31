import { Controller, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LocalGuard } from "../guards/local.guard";
import { Request } from "express";
import { ResponseInterceptor } from "src/common/response.interceptors";


@Controller('api/v1/auth')
@UseInterceptors(ResponseInterceptor)
export class AuthApiController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  
}
