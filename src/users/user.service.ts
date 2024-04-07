import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UserModel } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ActivateUserDto } from './dto/activate-user-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from './dto/email-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { UUID } from 'crypto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const newUser = new UserModel();
    newUser.email = createUserDto.email;
    newUser.firstname = createUserDto.firstname;
    newUser.lastname = createUserDto.lastname;
    newUser.password = await this.hashPassword(createUserDto.password);
    return await this.userRepository.save(newUser);
  }

  async activateUser(activateUserDto: ActivateUserDto) {
    const validToken = this.jwt.verify(activateUserDto.token, this.config.get('SECRET_KEY'));
    if (validToken.type !== 'activation') {
      return { status: 400, message: " Invalid Activation Code" }
    }

    const existingUser = await this.userRepository.createQueryBuilder().update(UserModel)
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
    const activationToken = this.jwt.sign({ email: email, type: 'activation' })

    this.emailService.sendActivationMail(email, existingUser.firstname, activationToken)
    // logger.info(`Resend Activation process triggered for user: ${email}`)

    return { status: 200, message: `success, an activation email will be re-send to your email`, token: activationToken };

  }

  async forgotPassword(forgotPasswordDto: EmailDto) {
    const email = forgotPasswordDto.email
    const token = this.jwt.sign({ email: email, type: 'forgot_password' })
    const existingUser = await this.userRepository.findOne({ where: { email: email } })

    if (!existingUser) {
      return { status: 404, message: "User With Email doesn't exist on this server" };
    }

    this.emailService.sendForgotPasswordMail(existingUser.email, existingUser.firstname, token)

    return { status: 200, message: `Password reset message sent to your mail` }

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto
    const decoded = this.jwt.verify(token);
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

  async findOneById(userId: UUID) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID '${userId}' not found`);
    }

    return user;
  }
  
}