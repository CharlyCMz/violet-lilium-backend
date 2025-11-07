import { Injectable, NotFoundException } from '@nestjs/common';
import { VariantAttribute } from '../entities/variant-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateVariantAttributeDTO,
  UpdateVariantAttributeDTO,
} from '../dtos/variant-attribute.dto';
import { AttributeService } from './attribute.service';

@Injectable()
export class VariantAttributeService {
  constructor(
    @InjectRepository(VariantAttribute)
    private variantAttributeRepository: Repository<VariantAttribute>,
    private attributeService: AttributeService,
  ) {}

  findAll() {
    return this.variantAttributeRepository.find();
  }

  async findOne(id: string) {
    const variantAttribute = await this.variantAttributeRepository.findOne({
      where: { id },
      relations: ['attribute'],
    });
    if (!variantAttribute) {
      throw new NotFoundException(
        `The Variant-Attribute with ID: ${id} was Not Found`,
      );
    }
    return variantAttribute;
  }

  async createEntity(payload: CreateVariantAttributeDTO) {
    const newVariantAttribute = this.variantAttributeRepository.create(payload);
    newVariantAttribute.attribute = await this.attributeService.findOne(
      payload.attributeId,
    );
    return await this.variantAttributeRepository.save(newVariantAttribute);
  }

  async updateEntity(id: string, payload: UpdateVariantAttributeDTO) {
    const variantAttribute = await this.variantAttributeRepository.findOneBy({
      id,
    });
    if (!variantAttribute) {
      throw new NotFoundException(
        `The Variant-Attribute with ID: ${id} was Not Found`,
      );
    }
    if (payload.attributeId) {
      variantAttribute.attribute = await this.attributeService.findOne(
        payload.attributeId,
      );
    }
    this.variantAttributeRepository.merge(variantAttribute, payload);
    return this.variantAttributeRepository.save(variantAttribute);
  }

  async deleteEntity(id: string) {
    const exist = await this.variantAttributeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Variant-Attribute with ID: ${id} was Not Found`,
      );
    }
    return this.variantAttributeRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.variantAttributeRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The Variant-Attribute with ID: ${id} was Not Found`,
      );
    }
    return this.variantAttributeRepository.delete(id);
  }
}
