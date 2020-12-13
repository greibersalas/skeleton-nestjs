import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class CountryService {

    constructor(
        @InjectRepository(CountryRepository)
        private readonly _countryRepository: CountryRepository
    ){}

    async get(id: number): Promise<Country>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const country = await this._countryRepository.findOne(id,{where:{state:1}});

        if(!country){
            throw new NotFoundException();
        }

        return country;
    }

    async getAll(): Promise<Country[]>{
        const country: Country[] = await this._countryRepository.find({where:{state:1}});
        return country;
    }

    async create(country: Country): Promise<Country>{
        const saveCountry: Country = await this._countryRepository.save(country);
        return saveCountry;
    }

    async update(id: number, country:Country): Promise<Country>{
        const countryExists = await this._countryRepository.findOne(id);
        if(!countryExists){
            throw new NotFoundException();
        }
        await this._countryRepository.update(id,country);
        const updateCountry : Country = await this._countryRepository.findOne(id);
        return updateCountry;
    }

    async delete(id: number): Promise<void>{
        const countryExists = await this._countryRepository.findOne(id);
        if(!countryExists){
            throw new NotFoundException();
        }
        await this._countryRepository.update(id,{state:0});
    }
}
