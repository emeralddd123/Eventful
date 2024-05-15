import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LocalGuard } from "../guards/local.guard";
import { Request } from "express";


@Controller('api/v1/auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  
}
