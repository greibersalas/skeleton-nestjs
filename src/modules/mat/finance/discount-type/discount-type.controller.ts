import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

import { DiscountTypeService } from './discount-type.service';
import { DiscountTypeDto } from './dto/discount-type-dto';

@UseGuards(JwtAuthGuard)
@Controller('discount-type')
export class DiscountTypeController {

    private module = 'discount-type';
    constructor(
        private service: DiscountTypeService
    ) { }

    @Get()
    async getAll(): Promise<DiscountTypeDto[]> {
        return await this.service.getAll();
    }
}
