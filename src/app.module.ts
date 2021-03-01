import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessLineModule } from './modules/business-line/business-line.module';
import { CampusModule } from './modules/campus/campus.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';
import { TariffModule } from './modules/tariff/tariff.module';
import { EnvironmentDoctorModule } from './modules/environment-doctor/environment-doctor.module';
import { InsuranceCarrierModule } from './modules/insurance-carrier/insurance-carrier.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ClinicHistoryModule } from './modules/clinic-history/clinic-history.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { CountryModule } from './modules/country/country.module';
import { CoinModule } from './modules/coin/coin.module';
import { ResponsibleModule } from './modules/responsible/responsible.module';
import { DeparmentsModule } from './modules/deparments/deparments.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { ExchangeRateModule } from './modules/exchange-rate/exchange-rate.module';
import { QuotationModule } from './modules/main/quotation/quotation.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { DentalStatusModule } from './modules/mat/dental-status/dental-status.module';
import { OdontogramaModule } from './modules/main/odontograma/odontograma.module';
import { ClinicHistoryNotesModule } from './modules/mat/clinic-history-notes/clinic-history-notes.module';
import { MedicalActModule } from './modules/main/medical-act/medical-act.module';
import { PrescriptionModule } from './modules/main/prescription/prescription.module';
import { LabOrderModule } from './modules/main/lab-order/lab-order.module';
import { BracketsModule } from './modules/mat/brackets/brackets.module';
import { LabOrderLabeledModule } from './modules/main/lab-order-labeled/lab-order-labeled.module';
import { LabeledStatusModule } from './modules/mat/labeled-status/labeled-status.module';
import { LabProgrammingModule } from './modules/main/lab-programming/lab-programming.module';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    RoleModule,
    AuthModule,
    BusinessLineModule,
    CampusModule,
    SpecialtyModule,
    TariffModule,
    EnvironmentDoctorModule,
    InsuranceCarrierModule,
    DoctorModule,
    ClinicHistoryModule,
    DocumentsModule,
    PaymentMethodModule,
    CountryModule,
    CoinModule,
    ResponsibleModule,
    DeparmentsModule,
    ProvincesModule,
    DistrictsModule,
    ExchangeRateModule,
    QuotationModule,
    ReservationModule,
    DentalStatusModule,
    OdontogramaModule,
    ClinicHistoryNotesModule,
    MedicalActModule,
    PrescriptionModule,
    LabOrderModule,
    BracketsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    LabOrderLabeledModule,
    LabeledStatusModule,
    LabProgrammingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly _configService: ConfigService){
    AppModule.port = this._configService.get(Configuration.PORT);
  }
}
