import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [MenuModule, PrismaModule],
})
export class AppModule {}
