import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampusController } from './campus.controller';
import { CampusRepository } from './campus.repository';
import { CampusService } from './campus.service';

@Module({
  imports: [ TypeOrmModule.forFeature([CampusRepository])],
  controllers: [CampusController],
  providers: [CampusService]
})
export class CampusModule {}
