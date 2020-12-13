import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import { CountryRepository } from './country.repository';
import { CountryService } from './country.service';

@Module({
  imports: [ TypeOrmModule.forFeature([CountryRepository])],
  controllers: [CountryController],
  providers: [CountryService]
})
export class CountryModule {}
