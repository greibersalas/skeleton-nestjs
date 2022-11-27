import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TariffHistory } from './tariff-history.entity';
import { TariffHistoryRepository } from './tariff-history.repository';
import { Tariff } from './tariff.entity';
import { TariffRepository } from './tariff.repository';

@Injectable()
export class TariffService {

    constructor(
        @InjectRepository(TariffRepository)
        private readonly _tariffRepository: TariffRepository,
        @InjectRepository(TariffHistoryRepository)
        private readonly _tariffHistoryRepository: TariffHistoryRepository
    ) { }

    async get(id: number): Promise<Tariff> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const tariff = await this._tariffRepository.findOne(id, { where: { state: 1 } });
        if (!tariff) {
            throw new NotFoundException();
        }

        return tariff;
    }

    async getAll(): Promise<Tariff[]> {
        const tariff: Tariff[] = await this._tariffRepository.find({ where: { state: 1 } });
        return tariff;
    }

    async create(tariff: Tariff): Promise<Tariff> {
        const saveTariff: Tariff = await this._tariffRepository.save(tariff);
        //INSERT HISTORY OF PRICE
        const history = new TariffHistory()
        history.price_sol_old = 0;
        history.price_usd_old = 0;
        history.price_sol_new = saveTariff.price_sol;
        history.price_usd_new = saveTariff.price_usd;
        history.tariff = saveTariff;
        return saveTariff;
    }

    async update(id: number, tariff: Tariff): Promise<Tariff> {
        const tariffExists = await this._tariffRepository.findOne(id);
        if (!tariffExists) {
            throw new NotFoundException();
        }
        tariffExists.specialty = tariff.specialty;
        tariffExists.name = tariff.name;
        tariffExists.price_sol = tariff.price_sol;
        tariffExists.price_usd = tariff.price_usd;
        tariffExists.odontograma = tariff.odontograma;
        tariffExists.description = tariff.description;
        tariffExists.dental_status = tariff.dental_status;
        tariffExists.bracket = tariff.bracket;
        tariffExists.cost = tariff.cost;
        tariffExists.cost_usd = tariff.cost_usd;
        tariffExists.idkeyfacil = tariff.idkeyfacil;
        tariffExists.show_diary = tariff.show_diary;
        await this._tariffRepository.update(id, tariffExists);
        const updateTariff: Tariff = await this._tariffRepository.findOne(id);
        return updateTariff;
    }

    async delete(id: number): Promise<void> {
        const tariffExists = await this._tariffRepository.findOne(id);
        if (!tariffExists) {
            throw new NotFoundException();
        }
        await this._tariffRepository.update(id, { state: 0 });
    }

    async addHistory(tariffHistory: TariffHistory): Promise<void> {
        await this._tariffHistoryRepository.save(tariffHistory);
    }

    async getBySpecialty(idspecialty: number): Promise<Tariff[]> {
        if (!idspecialty) {
            throw new BadRequestException('idspecialty must be send.');
        }
        const tariff: Tariff[] = await this._tariffRepository.find({ where: { specialty: idspecialty, state: 1 } });
        if (!tariff) {
            throw new NotFoundException();
        }
        return tariff;
    }

    async getByDentalStatus(id: number): Promise<Tariff[]> {
        if (!id) {
            throw new BadRequestException('iddentalstatus must be send');
        }
        //const tariff: Tariff = await this._tariffRepository.findOne({where:{state: 1,dental_status:id}});
        const tariff: Tariff[] = await this._tariffRepository
            .createQueryBuilder('tr')
            .where(':id = ANY(tr.dental_status) AND tr.state = 1', { id }).getMany();
        if (!tariff) {
            throw new NotFoundException('Tariff not found');
        }
        return tariff;
    }

    async getLabs(): Promise<Tariff[]> {
        const tariff: Tariff[] = await this._tariffRepository
            .createQueryBuilder("tr")
            .innerJoin("tr.specialty", "sp", "sp.laboratory = true")
            .where("tr.state = 1 AND tr.bracket = true").getMany();
        return tariff;
    }

    async getByBl(idbl: any): Promise<Tariff[]> {
        if (!idbl) {
            throw new BadRequestException('idspecialty must be send.');
        }
        const tariff: Tariff[] = await this._tariffRepository
            .createQueryBuilder("tr")
            .innerJoin("tr.specialty", "sp", "sp.businessLines IN(:...idbl)", { idbl })
            .where("tr.state <> 0").orderBy("tr.name", "ASC").getMany();
        if (!tariff) {
            throw new NotFoundException();
        }
        return tariff;
    }

    async getToDiary(): Promise<Tariff[]> {
        const tariff: Tariff[] = await this._tariffRepository
            .createQueryBuilder("tr")
            .where("tr.state <> 0")
            .andWhere(`show_diary = true`)
            .orderBy("tr.name", "ASC").getMany();
        return tariff;
    }

    async getQuotationTerms(): Promise<Tariff[]> {
        const tariff: Tariff[] = await this._tariffRepository
            .createQueryBuilder("tr")
            .where("tr.state <> 0 AND tr.id IN(58,171)").orderBy("tr.name", "ASC").getMany();
        if (!tariff) {
            throw new NotFoundException();
        }
        return tariff;
    }

    async getDataToContract(): Promise<Tariff[]> {
        return await this._tariffRepository.createQueryBuilder('tr')
            .select(`id, name, price_sol, price_usd`)
            .whereInIds([58, 120, 121, 122])
            .getRawMany();
    }
}
