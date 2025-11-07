import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SubCategory } from '../entities/sub-category.entity';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from '../dtos/sub-category.dto';
import { CategoryService } from './category.service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    private categoryService: CategoryService,
  ) {}

  async findAll() {
    return await this.subCategoryRepository.find({
      relations: ['category'],
    });
  }

  async findByName(filter: string) {
    return await this.subCategoryRepository.findOne({
      select: ['id', 'title'],
      where: { title: ILike(`%${filter}%`) },
    });
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      relations: ['category'],
      where: { id },
    });

    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return subCategory;
  }

  async findOneNoRelations(id: string) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return subCategory;
  }

  async createEntity(payload: CreateSubCategoryDTO) {
    const newCategory = this.subCategoryRepository.create(payload);
    newCategory.category = await this.categoryService.findOneNoRelations(
      payload.categoryId,
    );
    return this.subCategoryRepository.save(newCategory);
  }

  async updateEntity(id: string, payload: UpdateSubCategoryDTO) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    if (payload.categoryId) {
      subCategory.category = await this.categoryService.findOneNoRelations(
        payload.categoryId,
      );
    }
    this.subCategoryRepository.merge(subCategory, payload);
    return this.subCategoryRepository.save(subCategory);
  }

  async deleteEntity(id: string) {
    const exist = await this.subCategoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return this.subCategoryRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.subCategoryRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(
        `The SubCategory with ID: ${id} was Not Found`,
      );
    }
    return this.subCategoryRepository.delete(id);
  }
}
