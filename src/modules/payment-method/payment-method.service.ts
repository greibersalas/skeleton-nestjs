import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './payment-method.entity';
import { PaymentMethodRepository } from './payment-method.repository';

@Injectable()
export class PaymentMethodService {

    constructor(
        @InjectRepository(PaymentMethodRepository)
        private readonly _pmRepository: PaymentMethodRepository
    ){}

    async get(id: number): Promise<PaymentMethod>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const pm = await this._pmRepository.findOne(id,{where:{state:1}});

        if(!pm){
            throw new NotFoundException();
        }

        return pm;
    }

    async getAll(): Promise<PaymentMethod[]>{
        const pm: PaymentMethod[] = await this._pmRepository.find({where:{state:1}});
        return pm;
    }

    async create(bl: PaymentMethod): Promise<PaymentMethod>{
        const savePaymentMethod: PaymentMethod = await this._pmRepository.save(bl);
        return savePaymentMethod;
    }

    async update(id: number, pm:PaymentMethod): Promise<PaymentMethod>{
        const pmExists = await this._pmRepository.findOne(id);
        if(!pmExists){
            throw new NotFoundException();
        }
        await this._pmRepository.update(id,pm);
        const updatePaymentMethod : PaymentMethod = await this._pmRepository.findOne(id);
        return updatePaymentMethod;
    }

    async delete(id: number): Promise<void>{
        const pmExists = await this._pmRepository.findOne(id);
        if(!pmExists){
            throw new NotFoundException();
        }

        await this._pmRepository.update(id,{state:0});
    }
}
