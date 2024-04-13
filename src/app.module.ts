import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { AuthMiddleware } from './common/auth-middleware';
import { EventController } from './event/event.contoller';
import { PassportModule } from '@nestjs/passport';
import { AppConfig, DatabaseConfig } from './config';
import { TicketModule } from './ticket/ticket.module';
import { TicketController } from './ticket/ticket.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './notification/notification.module';


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
      // username: process.env.REDIS_USERNAME, 
      // password: process.env.REDIS_PASSWORD, 
      // no_ready_check: true,
    }),
    BullModule.forRoot({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
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
    NotificationModule
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(EventController),
      consumer.apply(AuthMiddleware).forRoutes(TicketController)

  }
}

