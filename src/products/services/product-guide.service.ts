import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductGuide } from '../entities/product-guide.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  CreateProductGuideDTO,
  UpdateProductGuideDTO,
} from '../dtos/product-guide.dto';
import { Image } from '../entities/image.entity';

@Injectable()
export class ProductGuideService {
  constructor(
    @InjectRepository(ProductGuide)
    private productGuideRepository: Repository<ProductGuide>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.productGuideRepository.find({
      relations: ['images']
    });
  }

  async findOne(id: string) {
    const productGuide = await this.productGuideRepository.findOne({
      where: { id },
      relations: ['images']
    });

    if (!productGuide) {
      throw new NotFoundException(
        `The ProductGuide with ID: ${id} was Not Found`,
      );
    }
    return productGuide;
  }

  async createEntity(payload: CreateProductGuideDTO) {
    return await this.dataSource.transaction(async (manager) => {
      const images = await manager.find(Image, {
        where: { id: In(payload.imageIds) },
      });
      let guide = manager.create(ProductGuide, {
        ...payload,
        images,
      });
      guide = await manager.save(ProductGuide, guide);
      return await manager.findOne(ProductGuide, {
        where: { id: guide.id },
        relations: ['images'],
      });
    });
  }

  async updateEntity(id: string, payload: UpdateProductGuideDTO) {
    const productGuide = await this.productGuideRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!productGuide) {
      throw new NotFoundException(
        `The ProductGuide with ID: ${id} was Not Found`,
      );
    }

    if (payload.imageIds) {
      const images = await this.imageRepository.find({
        where: { id: In(payload.imageIds) },
      });

      if (images.length !== payload.imageIds.length) {
        throw new BadRequestException('One or more images were not found');
      }

      productGuide.images = images;
    }

    const { imageIds, ...rest } = payload;
    this.productGuideRepository.merge(productGuide, rest);

    return await this.productGuideRepository.save(productGuide);
  }

  async deleteEntity(id: string) {
    const exist = await this.productGuideRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The ProductGuide with ID: ${id} was Not Found`,
      );
    }
    return this.productGuideRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.productGuideRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The ProductGuide with ID: ${id} was Not Found`,
      );
    }
    return this.productGuideRepository.delete(id);
  }
}
