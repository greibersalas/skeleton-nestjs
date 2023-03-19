import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountTypeDto } from './dto/discount-type-dto';
import { DiscountType } from './entity/discount-type.entity';

@Injectable()
export class DiscountTypeService {

    constructor(
        @InjectRepository(DiscountType)
        private readonly repository: Repository<DiscountType>
    ) { }

    async getAll(): Promise<DiscountTypeDto[]> {
        return await this.repository.createQueryBuilder('dt')
            .select('id, name, status')
            .where('status <> 0')
            .orderBy('name')
            .getRawMany();
    }
}
