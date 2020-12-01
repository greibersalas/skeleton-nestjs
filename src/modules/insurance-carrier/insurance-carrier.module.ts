import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceCarrierController } from './insurance-carrier.controller';
import { InsuranceCarrierRepository } from './insurance-carrier.repository';
import { InsuranceCarrierService } from './insurance-carrier.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsuranceCarrierRepository])
  ],
  controllers: [InsuranceCarrierController],
  providers: [InsuranceCarrierService]
})
export class InsuranceCarrierModule {}
