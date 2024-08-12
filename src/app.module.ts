import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfig, DatabaseConfig } from './config';
import { TicketModule } from './ticket/ticket.module';
import { CacheModule } from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-yet';
import { NotificationModule } from './notification/notification.module';
import { JobModule } from './job/job.module';


ConfigModule.forRoot()

const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY,
  signOptions: { expiresIn: '1h' },

};


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      ttl: 5000,  //time in milliseconds
      // username: process.env.REDIS_USERNAME, 
      // password: process.env.REDIS_PASSWORD, 
      // no_ready_check: true,
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig]
    }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    UserModule,
    AuthModule,
    EventModule,
    TicketModule,
    NotificationModule,
    JobModule,
  ],
})


export class AppModule { }