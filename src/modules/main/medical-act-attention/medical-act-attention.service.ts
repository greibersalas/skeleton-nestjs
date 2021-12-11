import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { MedicalActAttention } from './medical-act-attention.entity';
import { MedicalActAttentionRepository } from './medical-act-attention.repository';

@Injectable()
export class MedicalActAttentionService {

    constructor(
        @InjectRepository(MedicalActAttentionRepository)
        private readonly _medicalActAttentionRepository: MedicalActAttentionRepository
    ){}

    async get(id: number): Promise<MedicalActAttention>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }

        const medicalActAttention = await this._medicalActAttentionRepository.findOne(id,{where:{state:1}});

        if(!medicalActAttention){
            throw new NotFoundException();
        }

        return medicalActAttention;
    }

    async getAll(): Promise<MedicalActAttention[]>{
        const medicalActAttention: MedicalActAttention[] = await this._medicalActAttentionRepository.find({where:{state:1}});
        return medicalActAttention;
    }

    async create(medicalActAttention: MedicalActAttention): Promise<MedicalActAttention>{
        const saveMedicalActAttention: MedicalActAttention = await this._medicalActAttentionRepository.save(medicalActAttention);
        return saveMedicalActAttention;
    }

    async update(id: number, medicalActAttention:MedicalActAttention): Promise<MedicalActAttention>{
        const medicalActAttentionExists = await this._medicalActAttentionRepository.findOne(id);
        if(!medicalActAttentionExists){
            throw new NotFoundException();
        }
        await this._medicalActAttentionRepository.update(id,medicalActAttention);
        const updateMedicalActAttention : MedicalActAttention = await this._medicalActAttentionRepository.findOne(id);
        return updateMedicalActAttention;
    }

    async delete(id: number): Promise<void>{
        const medicalActAttentionExists = await this._medicalActAttentionRepository.findOne(id);
        if(!medicalActAttentionExists){
            throw new NotFoundException();
        }
        await this._medicalActAttentionRepository.update(id,{state:0});
    }

    async getByMedicalAct(id: number): Promise<MedicalActAttention[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        //const medicalActAttention = await this._medicalActAttentionRepository.find({where:{state:1,medicalact:id}});
        const medicalActAttention = await this._medicalActAttentionRepository.createQueryBuilder('mc')
        .innerJoinAndSelect("mc.tariff","tr")
        .innerJoinAndSelect("tr.specialty","sp")
        .innerJoinAndSelect("sp.businessLines","bl")
        .innerJoinAndSelect("mc.doctor",'dc')
        .where("mc.state = 1 AND mc.medicalact = :id",{id})
        .getMany();

        if(!medicalActAttention){
            throw new NotFoundException();
        }
        return medicalActAttention;
    }

    async getByCH(id: number, iddoctor: number): Promise<MedicalActAttention[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        let where: string = '';
        if(iddoctor === 0){
            where = `mc.state = 1 AND "mc"."patientId" = ${id}`;
        }else{
            where = `mc.state = 1 AND "mc"."patientId" = ${id} AND dc.id = ${iddoctor}`;
        }
        const medicalActAttention = await this._medicalActAttentionRepository.createQueryBuilder('mc')
        .innerJoinAndSelect("mc.tariff","tr")
        .innerJoinAndSelect("tr.specialty","sp")
        .innerJoinAndSelect("sp.businessLines","bl")
        .innerJoinAndSelect("mc.doctor",'dc')
        .where(`${where}`)
        .getMany();

        if(!medicalActAttention){
            throw new NotFoundException();
        }
        return medicalActAttention;
    }

    async cantReservation(month: number, year: number): Promise<any>{
        const cant = await this._medicalActAttentionRepository.createQueryBuilder('re')
        .where('EXTRACT(month FROM "date") = :month AND EXTRACT(YEAR FROM "date") = :year AND state <> 0',{month,year})
        .getCount();
        return cant;
    }

    async getQuantityAttentions(id: number): Promise<any[]>{
        if(!id){
            throw new BadRequestException('id must be send.');
        }
        const quantity = await this._medicalActAttentionRepository.createQueryBuilder('ma')
        .select(`dc.id AS iddoctor,
        "dc"."nameQuote" AS doctor,
      count(dc.id) AS quantity`)
        .innerJoin('doctor','dc','dc.id = "ma"."doctorId"')
        .where(`"ma"."patientId" = :id AND ma.state = 1`,{id})
        .groupBy(`dc.id,"dc"."nameQuote"`)
        .orderBy(`"dc"."nameQuote"`)
        .getRawMany();

        if(!quantity){
            throw new NotFoundException();
        }
        return quantity;
    }

    //Reports
    /**
     * Metodo para retornar la lista de
     * tratamientos realizados en un día
     * @param date
     * @param specialty
     * @param businessline
     * @return
     */
    async treatmentRealized(
        date: string,
        specialty: number,
        businessline: number,
        doctor: number
    ): Promise<any>{
        let where = `maa.date = :date AND maa.state = 1 `;
        if(businessline > 0){
            where += `AND "maa"."businesslineId" = ${businessline} `;
        }
        if(specialty > 0){
            where += ` AND "maa"."specialtyId" = ${specialty}`;
        }
        if(doctor > 0){
            where += ` AND "maa"."doctorId" = ${doctor}`;
        }
        const data = await this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`"maa"."tariffId",
        tr.description AS tratamiento,
        "maa"."doctorId" as iddoctor,
        count("maa"."tariffId")::NUMERIC as cantidad,
        sum(maa.value) as total`)
        .innerJoin('maa.tariff','tr')
        .where(`${where}`,{date})
        .groupBy('"maa"."tariffId",tr.description,"maa"."doctorId"')
        .orderBy('tr.description')
        .getRawMany();
        return data;
    }

    async top10Tariff(
        since: string,
        until: string
    ): Promise<any>{
        const q1 = this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`"maa"."businesslineId" AS bl,
        "maa"."tariffId",
        tr.description AS tratamiento,
        count("maa"."tariffId")::NUMERIC as cantidad,
        sum(maa.value) as total`)
        .where(`maa.date BETWEEN '${since}' AND '${until}' AND maa.state = 1
        and "maa"."businesslineId" = 2`)
        .innerJoin('maa.tariff','tr')
        .groupBy('"maa"."tariffId","maa"."businesslineId",tr.description')
        .getQuery();
        const q2 = this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`"maa"."businesslineId" AS bl,
        "maa"."tariffId",
        tr.description AS tratamiento,
        count("maa"."tariffId")::NUMERIC as cantidad,
        sum(maa.value) as total`)
        .where(`maa.date BETWEEN '${since}' AND '${until}' AND maa.state = 1
        and "maa"."businesslineId" = 3`)
        .innerJoin('maa.tariff','tr')
        .groupBy('"maa"."tariffId","maa"."businesslineId",tr.description')
        .getQuery();
        const entityManager = getManager();
        return await entityManager.query(`SELECT * FROM (${ q1 } UNION ALL ${ q2 }) AS foo ORDER BY foo.bl,foo.cantidad ASC, foo.tratamiento`)
    }

    async top5Specialty(since: string, until: string): Promise<any>{
        const cant = await this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`"maa"."businesslineId" AS bl,
        "maa"."specialtyId",
        "sp"."name" AS especialidad,
        count("maa"."tariffId")::NUMERIC as cantidad,
        sum("maa"."value") as total`)
        .innerJoin('maa.tariff','tr')
        .innerJoin('maa.specialty','sp')
        .where(`"maa"."date" BETWEEN '${since}' AND '${until}' AND "maa"."state" = 1 and "maa"."businesslineId" = 2`,{since,until})
        .groupBy('"maa"."specialtyId","maa"."businesslineId",sp.name')
        .orderBy('count("maa"."tariffId")','DESC')
        .limit(5)
        .getRawMany();
        return cant;
    }

    async getTtoByDoctor(date: string): Promise<any>{
        const data = await this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`"maa"."doctorId" AS iddoctor,
        "dr"."nameQuote" AS doctor,
        sum(quantity) AS cantidad,
        sum(value) AS total`)
        .innerJoin('doctor','dr','dr.id = "maa"."doctorId"')
        .where(`maa.state <> 0 AND maa.date = '${date}'`)
        .groupBy(`"maa"."doctorId","dr"."nameQuote"`)
        .orderBy(`"dr"."nameQuote"`)
        .getRawMany();
        return data;
    }

    async getPayPatient(filters: any): Promise<any>{
        const query = this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`ch.history,
        concat_ws( ' ', ch.name,"ch"."lastNameFather","ch"."lastNameMother" ) AS paciente,
        maa.quantity,
        maa.value,
        maa.date,
        CASE WHEN tr.price_usd > 0 THEN '$' ELSE 'S/' END as moneda`)
        .where(`maa.date BETWEEN '${filters.since}' AND '${filters.until}' AND maa.state = 1`)
        .innerJoin('maa.patient','ch')
        .innerJoin('maa.tariff','tr')
        .getQuery();
        const entityManager = getManager();
        return await entityManager.query(`SELECT
        foo.history,
        foo.paciente,
        sum(foo.quantity) AS cantidad,
        sum(foo.value) AS total,
        foo.date,
        foo.moneda
        FROM (${ query }) AS foo
        GROUP BY foo.history,foo.date,foo.moneda,foo.paciente
        ORDER BY foo.date,foo.paciente`)
    }

    async getDoctorProduction(params: any): Promise<any>{
        const { since,until,iddoctor } = params;
        return await this._medicalActAttentionRepository.createQueryBuilder('maa')
        .select(`maa.quantity,
        maa.value,
        "maa"."businesslineId",
        "maa"."specialtyId",
        "maa"."tariffId",
        "maa"."doctorId",
        "maa"."coId",
        "maa"."userId",
        maa.date,
        "maa"."patientId",
        "dc"."nameQuote" AS doctor,
        dc.type_payment,
        dc.porcentage,
        dc.payment,
        tr.price_sol,
        tr.price_usd,
        concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother","ch"."name") AS patient`)
        .innerJoin('maa.doctor','dc')
        .innerJoin('maa.tariff','tr')
        .innerJoin('maa.patient','ch')
        .where(`maa.date BETWEEN :since AND :until
        AND maa.state = 1 AND "maa"."doctorId" = :iddoctor`,{since,until,iddoctor})
        .orderBy(`maa.date`)
        .getRawMany();
    }
}
