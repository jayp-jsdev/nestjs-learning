import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GrantAccessToken } from './common/middleware/grant-access-token';
import { User } from './user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      { path: 'user', module: UserModule },
      { path: 'auth', module: AuthModule },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [User],
        synchronize: true,
        host: process.env.HOST,
        port: Number(process.env.PORT) || 5433,
        username: 'postgres',
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GrantAccessToken).forRoutes('*');
  }
}
