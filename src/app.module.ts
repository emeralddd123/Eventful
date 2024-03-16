import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtModuleOptions,  } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

ConfigModule.forRoot()

const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY, 
  signOptions: { expiresIn: '1h' },
};

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      url: process.env.MYSQL_DB,
    }),
    JwtModule.register(jwtConfig),
    UserModule,
    AuthModule
  ],
})


export class AppModule { }
