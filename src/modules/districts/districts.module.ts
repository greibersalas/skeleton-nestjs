import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsController } from './districts.controller';
import { DistrictsRepository } from './districts.repository';
import { DistrictsService } from './districts.service';

@Module({
  imports: [ TypeOrmModule.forFeature([DistrictsRepository])],
  controllers: [DistrictsController],
  providers: [DistrictsService]
})
export class DistrictsModule {}
