import { EntityRepository, Repository } from "typeorm";
import { Documents } from "./documents.entity";

@EntityRepository(Documents)
export class DocumentRepository extends Repository<Documents>{}