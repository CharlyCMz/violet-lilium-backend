import { Injectable, NotFoundException } from '@nestjs/common';
import { Person } from '../entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDTO, UpdatePersonDTO } from '../dtos/person.dto';
import { AddressService } from './address.service';
import { DocTypeService } from './doc-type.service';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private addressService: AddressService,
    private docTypeService: DocTypeService,
  ) {}

  findAll() {
    return this.personRepository.find({
      relations: ['docType'],
    });
  }

  async findOne(id: string) {
    const person = await this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.addresses', 'addresses')
      .leftJoinAndSelect('addresses.location', 'location')
      .leftJoinAndSelect('person.docType', 'docType')
      .where('person.id = :id', { id })
      .getOne();
    if (!person) {
      throw new NotFoundException(`The Person with ID: ${id} was Not Found`);
    }
    return person;
  }

  async findByDocumentNumber(docTypeId: string, document: string) {
    const person = await this.personRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.docType', 'docType')
      .where('docType.id = :docTypeId', { docTypeId })
      .andWhere('person.document = :document', {
        document,
      })
      .getOne();
    return person?.id ?? null;
  }

  async createEntity(payload: CreatePersonDTO) {
    const docType = await this.docTypeService.findOne(payload.docTypeId);
    let newPerson = this.personRepository.create(payload);
    newPerson.docType = docType;
    newPerson = await this.personRepository.save(newPerson);
    await this.addressService.createEntity({
      ...payload.address,
      personId: newPerson.id,
    });
    return await this.findOne(newPerson.id);
  }

  async updateEntity(id: string, payload: UpdatePersonDTO) {
    const person = await this.personRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundException(`The Person with ID: ${id} was Not Found`);
    }
    if (payload.docTypeId) {
      person.docType = await this.docTypeService.findOne(payload.docTypeId);
    }
    this.personRepository.merge(person, payload);
    return this.personRepository.save(person);
  }

  async deleteEntity(id: string) {
    const exist = await this.personRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Person with ID: ${id} was Not Found`);
    }
    return this.personRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.personRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Person with ID: ${id} was Not Found`);
    }
    return this.personRepository.delete(id);
  }
}
