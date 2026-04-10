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
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
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
        synchronize: false,
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
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GrantAccessToken).forRoutes('*');
  }
}
