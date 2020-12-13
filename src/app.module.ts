import { Module } from '@nestjs/common';
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
    CountryModule
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
