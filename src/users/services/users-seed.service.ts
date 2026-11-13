import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { DocType } from '../entities/doc-type.entity';

const SEED_ROLES = [
  { name: 'Admin', description: 'Full access to the platform administration' },
  { name: 'Customer', description: 'Registered e-commerce customer' },
];

const SEED_DOC_TYPES = [
  { code: 'CC', name: 'Cédula de Ciudadanía' },
  { code: 'CE', name: 'Cédula de Extranjería' },
  { code: 'NIT', name: 'NIT' },
  { code: 'PPT', name: 'Permiso por Protección Temporal' },
  { code: 'TI', name: 'Tarjeta de Identidad' },
];

@Injectable()
export class UsersSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersSeedService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(DocType)
    private docTypeRepository: Repository<DocType>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedDocTypes();
  }

  private async seedRoles() {
    for (const seed of SEED_ROLES) {
      const exists = await this.roleRepository.findOneBy({ name: seed.name });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create(seed));
        this.logger.log(`Role "${seed.name}" created`);
      }
    }
  }

  private async seedDocTypes() {
    for (const seed of SEED_DOC_TYPES) {
      const exists = await this.docTypeRepository.findOneBy({
        code: seed.code,
      });
      if (!exists) {
        await this.docTypeRepository.save(this.docTypeRepository.create(seed));
        this.logger.log(`DocType "${seed.code}" created`);
      }
    }
  }
}
