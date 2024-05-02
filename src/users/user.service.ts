import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ActivateUserDto } from './dto/activate-user-dto';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from './dto/email-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { UserDto } from './dto/user-dto';
import { plainToClass } from 'class-transformer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
  private jwtOptions: JwtModuleOptions;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectQueue('mail_queue')
    private MailQueue: Queue,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService
  ) {
    this.jwtOptions = {
      secret: process.env.SECRET_KEY,
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
      await this.MailQueue.add('send_activation_mail', { ...resUser, activationToken: activationToken }, { attempts: 2 })
      console.log(`send activation mail job started for ${resUser.email}`)
      return resUser
    } catch (error) {
      console.log(error)
      throw new HttpException('An Error Occured', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async activateUser(activateUserDto: ActivateUserDto) {
    const validToken = this.jwt.verify(activateUserDto.token, this.config.get('SECRET_KEY'));
    if (validToken.type !== 'activation') {
      return { status: 400, message: " Invalid Activation Code" }
    }

    const existingUser = await this.userRepository.createQueryBuilder().update(User)
      .set({ isActive: true }).where({ email: validToken.email })
      .execute()

    if (!existingUser) {
      return { status: 404, message: "User With Email doesn't exist on this server" };
    }

    // logger.info(`User: ${existingUser.email} activated their Account Succesfully`)
    return { status: 200, message: `Account activated succesfully` }
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
    await this.MailQueue.add('send_activation_mail', { ...existingUser, activationToken: activationToken }, { attempts: 2 })

    // logger.info(`Resend Activation process triggered for user: ${email}`)

    return { status: 200, message: `success, an activation email will be re-send to your email`, token: activationToken };

  }

  async forgotPassword(forgotPasswordDto: EmailDto) {
    const email = forgotPasswordDto.email
    const resetToken = await this.jwt.signAsync({ email: email, type: 'forgot_password' }, this.jwtOptions)
    const existingUser = await this.userRepository.findOne({ where: { email: email } })

    if (!existingUser) {
      return { status: 404, message: "User With Email doesn't exist on this server" };
    }
    await this.MailQueue.add('send_forgot_password_mail', { ...existingUser, token: resetToken }, { attempts: 2 })

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