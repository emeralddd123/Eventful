import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ActivateUserDto } from './dto/activate-user-dto';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from './dto/email-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { UserDto } from './dto/user-dto';
import { plainToClass } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  private jwtOptions: JwtModuleOptions;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.jwtOptions = {
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.firstname = createUserDto.firstname;
      newUser.lastname = createUserDto.lastname;
      newUser.password = await this.hashPassword(createUserDto.password);
      const user = await this.userRepository.save(newUser)
      const resUser = plainToClass(UserDto, user, {
        excludeExtraneousValues: true,
        strategy: 'excludeAll',
        enableCircularCheck: true,
      });
      const activationToken = await this.jwt.signAsync({ email: newUser.email, type: 'activation' }, this.jwtOptions)
      this.eventEmitter.emit('send_activation_mail', { ...resUser, activationToken: activationToken })
      console.log(`send_activation_mail event emitted for ${resUser.email}`)
      return resUser
    } catch (error) {
      console.log(error)
      throw new HttpException('An Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async activateUser(activateUserDto: ActivateUserDto) {
    try {
      const { token } = activateUserDto;
      const validToken = await this.jwt.verify(token, this.jwtOptions);
      console.log(validToken);
      if (validToken.type !== 'activation') {
        return { status: 400, message: " Invalid Activation Code" };
      }

      const existingUser = await this.userRepository.createQueryBuilder().update(User)
        .set({ isActive: true }).where({ email: validToken.email })
        .execute();

      if (!existingUser) {
        return { status: 404, message: "User With Email doesn't exist on this server" };
      }

      // logger.info(`User: ${existingUser.email} activated their Account Succesfully`)
      return { status: 200, message: `Account activated succesfully` };
    } catch (error) {
      console.log(error);
      throw new HttpException('An Error Occured', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resendActivationMail(resendActivationDto: EmailDto) {
    const email = resendActivationDto.email
    const existingUser = await this.userRepository.findOne({ where: { email: email } })
    if (!existingUser) {
      return { status: 404, message: "User With Email doesn't exist on this server" };
    }

    if (existingUser.isActive) {
      return { status: 208, message: "Account Already Activated" };
    }
    const activationToken = await this.jwt.signAsync({ email: email, type: 'activation' }, this.jwtOptions)
    this.eventEmitter.emit('send_activation_mail', { ...existingUser, activationToken: activationToken })

    // logger.info(`Resend Activation process triggered for user: ${email}`)

    return { status: 200, message: `success, an activation email will be re-send to your email`, token: activationToken };

  }

  async forgotPassword(forgotPasswordDto: EmailDto) {
    const { email } = forgotPasswordDto
    const resetToken = await this.jwt.signAsync({ email: email, type: 'forgot_password' }, this.jwtOptions)
    const existingUser = await this.userRepository.findOne({ where: { email: email } })

    if (!existingUser) {
      return { status: 404, message: "User With Email doesn't exist on this server" };
    }
    this.eventEmitter.emit('send_forgot_password_mail', { ...existingUser, token: resetToken })
    console.log(`forgot password mail emitted`)
    return { status: 200, message: `Password reset message sent to your mail` }

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto
    const decoded = this.jwt.verify(token, this.jwtOptions);
    if (decoded.type !== 'forgot_password') {
      return { status: 400, message: 'Invalid Reset Password Token' }
    }
    const email = decoded.email;
    const existingUser = await this.userRepository.findOne({ where: { email: email } })


    existingUser.password = await this.hashPassword(password)
    await this.userRepository.save(existingUser)

    // logger.info(`user: ${email} reset password succesfully`)

    return { status: 200, message: `Password has been reset sucessfully!!` }
  }

  async findOneById(userId: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID '${userId}' not found`);
    }

    return user;
  }
}
