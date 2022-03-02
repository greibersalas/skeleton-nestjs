import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { Coin } from './coin.entity';
import { CoinService } from './coin.service';
@UseGuards(JwtAuthGuard)
@Controller('coin')
export class CoinController {
    constructor(private readonly _CoinService: CoinService){}

    @Get(':id')
    async getCoin(@Param('id',ParseIntPipe) id: number): Promise<Coin>{
        const Coin = await this._CoinService.get(id);
        return Coin;
    }

    @Get()
    async getCoins(): Promise<Coin[]>{
        const Coin = await this._CoinService.getAll();
        return Coin;
    }

    @Post()
    async createCoin(@Body() Coin: Coin): Promise<Coin>{
        const create = await this._CoinService.create(Coin);
        return create;
    }

    @Put(':id')
    async updateCoin(@Param('id',ParseIntPipe) id: number, @Body() Coin: Coin){
        const update = await this._CoinService.update(id,Coin);
        return update;
    }

    @Delete(':id')
    async deleteCoin(@Param('id',ParseIntPipe) id: number){
        await this._CoinService.delete(id);
        return true;
    }
}
