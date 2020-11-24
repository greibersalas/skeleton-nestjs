import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessLineController } from './business-line.controller';
import { BusinessLineRepository } from './business-line.repository';
import { BusinessLineService } from './business-line.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessLineRepository])
  ],
  controllers: [BusinessLineController],
  providers: [BusinessLineService]
})
export class BusinessLineModule {}
