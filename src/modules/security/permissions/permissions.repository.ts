import { EntityRepository, Repository } from "typeorm";
import { Permissions } from "./permissions.entity";

@EntityRepository(Permissions)
export class PermissionsRepository extends Repository<Permissions>{}