import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtModuleOptions,  } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { AuthMiddleware } from './common/auth-middleware';
import { EventController } from './event/event.contoller';
import { PassportModule } from '@nestjs/passport';

ConfigModule.forRoot()

const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY,
  signOptions: { expiresIn: '1h' },
};


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRoot({
      autoLoadEntities:true,
      type:'mysql',
      host:process.env.DB_HOST || 'localhost',
      port:parseInt(process.env.DB_PORT) || 3306,
      username:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME,
      // synchronize: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    UserModule,
    AuthModule,
    EventModule
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes(EventController)
  }
 }



// TypeOrmModule.forRootAsync({
//   imports: [ConfigModule],
//   useFactory: async (configService: ConfigService) => ({
//     type: 'mysql',
//     url: configService.get<string>('MYSQL_DB'),
//   }),
//   inject: [ConfigService],
// }),