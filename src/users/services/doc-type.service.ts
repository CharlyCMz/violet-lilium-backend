import { Injectable, NotFoundException } from '@nestjs/common';
import { DocType } from '../entities/doc-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocTypeDTO, UpdateDocTypeDTO } from '../dtos/doc-type.dto';

@Injectable()
export class DocTypeService {
  constructor(
    @InjectRepository(DocType)
    private docTypeRepository: Repository<DocType>,
  ) {}

  findAll() {
    return this.docTypeRepository.find();
  }

  async findOne(id: string) {
    const docType = await this.docTypeRepository
      .createQueryBuilder('docType')
      .where('docType.id = :id', { id })
      .getOne();
    if (!docType) {
      throw new NotFoundException(
        `The Document Type with ID: ${id} was Not Found`,
      );
    }
    return docType;
  }

  createEntity(payload: CreateDocTypeDTO) {
    const newDocType = this.docTypeRepository.create(payload);
    return this.docTypeRepository.save(newDocType);
  }

  async updateEntity(id: string, payload: UpdateDocTypeDTO) {
    const docType = await this.docTypeRepository.findOneBy({ id });
    if (!docType) {
      throw new NotFoundException(
        `The Document Type with ID: ${id} was Not Found`,
      );
    }
    this.docTypeRepository.merge(docType, payload);
    return this.docTypeRepository.save(docType);
  }

  async deleteEntity(id: string) {
    const exist = await this.docTypeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Document Type with ID: ${id} was Not Found`,
      );
    }
    return this.docTypeRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.docTypeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Document Type with ID: ${id} was Not Found`,
      );
    }
    return this.docTypeRepository.delete(id);
  }
}
