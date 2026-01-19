import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findAll() {
    return await this.imageRepository.find({
      relations: ['productVariant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findGroup(ids: string[]) {
    return await this.imageRepository.find({
    where: { id: In(ids) }
  });
  }

  async findByProductVariantId(productVariantId: string) {
    return await this.imageRepository.find({
      relations: ['productVariant'],
      where: { productVariant: { id: productVariantId } },
    });
  }

  async findOne(id: string) {
    const image = this.imageRepository.findOne({
      relations: ['productVariant'],
      where: { id },
    });
    if (!image) {
      throw new NotFoundException(`Image with id "${id}" not found`);
    }
    return image;
  }

  async createEntity(payload: CreateImageDTO) {
    const newImage = this.imageRepository.create(payload);
    if (payload.productVariantId) {
      const productVariant = await this.productVariantRepository.findOneBy({
        id: payload.productVariantId,
      });
      if (!productVariant) {
        throw new NotFoundException(
          `ProductVariant with id "${payload.productVariantId}" not found`,
        );
      }
      newImage.productVariant = productVariant;
    }
    return await this.imageRepository.save(newImage);
  }

  async updateEntity(id: string, payload: UpdateImageDTO) {
    let image = await this.imageRepository.findOne({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    this.imageRepository.merge(image, payload);
    if (payload.productVariantId) {
      const productVariant = await this.productVariantRepository.findOneBy({
        id: payload.productVariantId,
      });
      if (!productVariant) {
        throw new NotFoundException(
          `ProductVariant with id "${payload.productVariantId}" not found`,
        );
      }
      image.productVariant = productVariant;
    }
    return await this.imageRepository.save(image);
  }

  async deleteEntity(id: string) {
    const exist = await this.imageRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    return this.imageRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.imageRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Image with ID: ${id} was Not Found`);
    }
    return this.imageRepository.delete(id);
  }
}
