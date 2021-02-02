import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OdontogramaController } from './odontograma.controller';
import { OdontogramaRepository } from './odontograma.repository';
import { OdontogramaService } from './odontograma.service';

@Module({
  imports: [TypeOrmModule.forFeature([OdontogramaRepository])],
  controllers: [OdontogramaController],
  providers: [OdontogramaService]
})
export class OdontogramaModule {}
