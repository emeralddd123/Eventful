import { Controller, Post, Body, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto'
import { ActivateUserDto } from './dto/activate-user-dto';
import { EmailDto } from './dto/email-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('activate')
  activateUser(@Body() activateUserDto: ActivateUserDto) {
    return this.userService.activateUser(activateUserDto)
  }

  @Post('resend-activation')
  resendActivationMail(@Body() resendActivationDto: EmailDto) {
    return this.userService.resendActivationMail(resendActivationDto)
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: EmailDto) {
    return this.userService.forgotPassword(forgotPasswordDto)
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto)
  }

}
