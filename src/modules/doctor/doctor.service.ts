import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { Doctor } from './doctor.entity';
import { DoctorRepository } from './doctor.repository';
import { DoctorBasicDto } from './dto/doctor-basic-dto';

@Injectable()
export class DoctorService {

    constructor(
        @InjectRepository(DoctorRepository)
        private readonly _doctorRepository: DoctorRepository
    ) { }

    async get(id: number): Promise<Doctor> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const doctor = await this._doctorRepository.findOne(id, { where: { state: 1 } });

        if (!doctor) {
            throw new NotFoundException();
        }

        return doctor;
    }

    async getAll(): Promise<Doctor[]> {
        const doctors: Doctor[] = await this._doctorRepository.find({ where: { state: 1 } });
        return doctors;
    }

    async getList(): Promise<DoctorBasicDto[]> {
        return await this._doctorRepository.createQueryBuilder('dr')
            .select('dr.id, dr."nameQuote" AS name')
            .where('dr.state <> 0')
            .orderBy('dr."nameQuote"', 'ASC')
            .getRawMany();
    }

    async create(doctor: Doctor): Promise<Doctor> {
        const saveDoctor: Doctor = await this._doctorRepository.save(doctor);
        return saveDoctor;
    }

    async update(id: number, doctor: Doctor): Promise<Doctor> {
        const existsDoctor = await this._doctorRepository.findOne(id);
        if (!existsDoctor) {
            throw new NotFoundException();
        }
        await this._doctorRepository.update(id, doctor);
        const updateDoctor: Doctor = await this._doctorRepository.findOne(id);
        return updateDoctor;
    }

    async delete(id: number): Promise<void> {
        const doctorExists = await this._doctorRepository.findOne(id);
        if (!doctorExists) {
            throw new NotFoundException();
        }

        await this._doctorRepository.update(id, { state: 0 });
    }

    async getInBl(id: any, day: number): Promise<Doctor[]> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        let mon = false, tue = false, wed = false, thu = false, fri = false, sat = false, sun = false;
        let doctors: Doctor[];
        switch (day) {
            case 0:
                sun = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`sun = :sun`, { sun })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 1:
                mon = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`mon = :mon`, { mon })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 2:
                tue = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`tue = :tue`, { tue })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 3:
                wed = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`wed = :wed`, { wed })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 4:
                thu = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`thu = :thu`, { thu })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 5:
                fri = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`fri = :fri`, { fri })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break;
            case 6:
                sat = true;
                doctors = await getManager()
                    .createQueryBuilder()
                    .select("id,nameQuote,morning_schedule,afternoon_schedule")
                    .from(sub => {
                        return sub.select(`id,"nameQuote" AS nameQuote,morning_schedule,afternoon_schedule,
                    business_lines,
                   generate_subscripts(business_lines, 1) AS s`)
                            .from(Doctor, "dr")
                            .where(`sat = :sat`, { sat })
                    }, "foo")
                    .where(`business_lines[s] in (:...id)`, { id })
                    .distinct(true)
                    .getRawMany();
                break
            default:
                console.log(`Sorry, we are out of ${day}.`);
                doctors = await this._doctorRepository
                    .createQueryBuilder()
                    .where(`state <> 0 AND :id = ANY(business_lines)`, { id })
                    .getMany();
        }
        if (!doctors) {
            throw new NotFoundException();
        }
        return doctors;
    }
}
