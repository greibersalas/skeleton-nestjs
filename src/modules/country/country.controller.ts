import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { Country } from './country.entity';
import { CountryService } from './country.service';
@UseGuards(JwtAuthGuard)
@Controller('country')
export class CountryController {

    constructor(private readonly _countryService: CountryService){}

    @Get(':id')
    async getCountry(@Param('id',ParseIntPipe) id: number): Promise<Country>{
        const country = await this._countryService.get(id);
        return country;
    }

    @Get()
    async getCountrys(): Promise<Country[]>{
        const country = await this._countryService.getAll();
        return country;
    }

    @Post()
    async createCountry(@Body() country: Country): Promise<Country>{
        const create = await this._countryService.create(country);
        return create;
    }

    @Put(':id')
    async updateCountry(@Param('id',ParseIntPipe) id: number, @Body() country: Country){
        const update = await this._countryService.update(id,country);
        return update;
    }

    @Delete(':id')
    async deleteCountry(@Param('id',ParseIntPipe) id: number){
        await this._countryService.delete(id);
        return true;
    }
}
