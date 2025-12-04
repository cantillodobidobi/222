import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.modules';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule } from './positons/positions.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, PositionsModule],
})
export class AppModule {}