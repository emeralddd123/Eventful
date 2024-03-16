import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller'
import { UserService } from './user.service';
import { UserModel } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserModel]),],
    controllers: [UserController],
    providers: [UserService],
  })
export class UserModule {}
