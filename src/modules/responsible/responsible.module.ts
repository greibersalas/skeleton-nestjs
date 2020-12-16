import { Module } from '@nestjs/common';
import { ResponsibleController } from './responsible.controller';
import { ResponsibleRepository } from "./responsible.repository"
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsibleService } from './responsible.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ResponsibleRepository])],
  providers: [ResponsibleService],
  controllers: [ResponsibleController]
})
export class ResponsibleModule {}
