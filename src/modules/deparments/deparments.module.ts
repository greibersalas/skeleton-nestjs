import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeparmentsController } from './deparments.controller';
import { DeparmentsRepository } from './deparments.repository';
import { DeparmentsService } from './deparments.service';

@Module({
  imports: [ TypeOrmModule.forFeature([DeparmentsRepository])],
  controllers: [DeparmentsController],
  providers: [DeparmentsService]
})
export class DeparmentsModule {}