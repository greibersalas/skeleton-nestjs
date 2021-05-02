import { EntityRepository, Repository } from "typeorm";
import { MasterPermissions } from "./master-permissions.entity";

@EntityRepository(MasterPermissions)
export class MasterPermissionsRepository extends Repository<MasterPermissions>{}