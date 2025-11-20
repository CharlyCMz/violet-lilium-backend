import { Injectable, NotFoundException } from '@nestjs/common';
import { Attribute } from '../entities/attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeDTO, UpdateAttributeDTO } from '../dtos/attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  findAll() {
    return this.attributeRepository.find({
      relations: ['variantsAttributes'],
    });
  }

  async findOne(id: string) {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`The Attribute with ID: ${id} was Not Found`);
    }
    return attribute;
  }

  async createEntity(payload: CreateAttributeDTO) {
    return await this.attributeRepository.save(payload);
  }

  async updateEntity(id: string, payload: UpdateAttributeDTO) {
    const attribute = await this.attributeRepository.findOneBy({ id });
    if (!attribute) {
      throw new NotFoundException(`The Attribute with ID: ${id} was Not Found`);
    }
    this.attributeRepository.merge(attribute, payload);
    return this.attributeRepository.save(attribute);
  }

  async deleteEntity(id: string) {
    const exist = await this.attributeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Attribute with ID: ${id} was Not Found`);
    }
    return this.attributeRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.attributeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Attribute with ID: ${id} was Not Found`);
    }
    return this.attributeRepository.delete(id);
  }
}
