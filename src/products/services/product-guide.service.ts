import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductGuide } from '../entities/product-guide.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductGuideDTO, UpdateProductGuideDTO } from '../dtos/product-guide.dto';

@Injectable()
export class ProductGuideService {
  constructor(
    @InjectRepository(ProductGuide)
    private productGuideRepository: Repository<ProductGuide>,
  ) {}

  async findAll() {
    return await this.productGuideRepository.find();
  }

  async findOne(id: string) {
    const productGuide = await this.productGuideRepository.findOne({
      where: { id },
    });

    if (!productGuide) {
      throw new NotFoundException(`The ProductGuide with ID: ${id} was Not Found`);
    }
    return productGuide;
  }

  async createEntity(payload: CreateProductGuideDTO) {
    return await this.productGuideRepository.save(payload);
  }

  async updateEntity(id: string, payload: UpdateProductGuideDTO) {
    const productGuide = await this.productGuideRepository.findOneBy({ id });
    if (!productGuide) {
      throw new NotFoundException(`The ProductGuide with ID: ${id} was Not Found`);
    }
    this.productGuideRepository.merge(productGuide, payload);
    return this.productGuideRepository.save(productGuide);
  }

  async deleteEntity(id: string) {
    const exist = await this.productGuideRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The ProductGuide with ID: ${id} was Not Found`);
    }
    return this.productGuideRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.productGuideRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The ProductGuide with ID: ${id} was Not Found`);
    }
    return this.productGuideRepository.delete(id);
  }
}
