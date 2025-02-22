import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('SIGINT', () => {
      app
        .close()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error('Error during shutdown', error);
          process.exit(1);
        });
    });

    process.on('SIGTERM', () => {
      app.close().then(
        () => process.exit(0),
        (error) => {
          console.error('Error during shutdown', error);
          process.exit(1);
        },
      );
    });
  }
}
