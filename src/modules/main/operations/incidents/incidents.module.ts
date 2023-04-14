import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { Incidents } from './entity/incident.entity';
import { ViewIncidents } from './entity/incidents-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incidents, ViewIncidents])],
  controllers: [IncidentsController],
  providers: [IncidentsService]
})
export class IncidentsModule { }
