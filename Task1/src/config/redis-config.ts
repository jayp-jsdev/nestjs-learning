import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private clients!: Record<string, Redis>;

  onModuleInit() {
    console.log('Initializing RedisService...');
    const client = new Redis(process.env.REDIS_URL!);

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis error', err));

    this.clients = {
      default: client,
    };
  }

  getClient(name?: string): Redis {
    return this.clients[name ?? 'default'];
  }
}
