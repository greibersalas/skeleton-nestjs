import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesController } from './provinces.controller';
import { ProvincesRepository } from './provinces.repository';
import { ProvincesService } from './provinces.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ProvincesRepository])],
  controllers: [ProvincesController],
  providers: [ProvincesService]
})
export class ProvincesModule {}
