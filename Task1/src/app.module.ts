import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GrantAccessToken } from './common/middleware/grant-access-token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { BullModule } from '@nestjs/bullmq';
import { EmailWorker } from './common/workers/email-worker';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          auth: {
            user: 'jayp.jsdev@gmail.com',
            pass: 'kzly ogak gbqu come',
          },
        },
      }),
    }),
    RouterModule.register([
      { path: 'user', module: UserModule },
      { path: 'auth', module: AuthModule },
      { path: 'product', module: ProductModule },
      { path: 'order', module: OrderModule },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        // entities: [User, Order, Product, OrderItem],
        autoLoadEntities: true,
        synchronize: true,
        host: process.env.HOST,
        port: Number(process.env.PORT) || 5433,
        username: 'postgres',
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrationsTableName: 'migrations',
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailWorker],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GrantAccessToken).forRoutes('*');
  }
}
