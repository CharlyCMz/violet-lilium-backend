import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find({
      relations: ['subCategories'],
      order: { viewOrder: 'ASC' },
    });
  }

  async featuredCategories() {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .leftJoin('product.productVariants', 'variant')
      .select('category.id', 'id')
      .addSelect('category.title', 'title')
      .addSelect('category.description', 'description')
      .addSelect('category.imageUrl', 'imageUrl')
      .addSelect('SUM(variant.total_sales)', 'totalSales')
      .groupBy('category.id')
      .addGroupBy('category.title')
      .addGroupBy('category.description')
      .addGroupBy('category.imageUrl')
      .orderBy('"totalSales"', 'DESC')
      .limit(5)
      .getRawMany();
  }

  async findByName(filter: string) {
    return await this.categoryRepository.findOne({
      select: ['id', 'title'],
      where: { title: ILike(`%${filter}%`) },
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }

    return category;
  }

  async findOneNoRelations(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return category;
  }

  createEntity(payload: CreateCategoryDTO) {
    const newCategory = this.categoryRepository.create(payload);
    return this.categoryRepository.save(newCategory);
  }

  async updateEntity(id: string, payload: UpdateCategoryDTO) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    this.categoryRepository.merge(category, payload);
    return this.categoryRepository.save(category);
  }

  async deleteEntity(id: string) {
    const exist = await this.categoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return this.categoryRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.categoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Category with ID: ${id} was Not Found`);
    }
    return this.categoryRepository.delete(id);
  }
}
