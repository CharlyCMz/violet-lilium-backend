import { Module } from '@nestjs/common';
import { AttributeService } from './services/attribute.service';
import { AttributeController } from './controllers/attibute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { Category } from './entities/category.entity';
import { Image } from './entities/image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';
import { SubCategory } from './entities/sub-category.entity';
import { CategoryService } from './services/category.service';
import { SubCategoryService } from './services/sub-category.service';
import { CategoryController } from './controllers/category.controller';
import { SubCategoryController } from './controllers/sub-category.controller';
import { ProductService } from './services/product.service';
import { ProductVariantService } from './services/product-variant.service';
import { ImagesService } from './services/images.service';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attribute,
      Category,
      Image,
      ProductVariant,
      Product,
      SubCategory,
    ]),
  ],
  providers: [
    AttributeService,
    CategoryService,
    SubCategoryService,
    ProductService,
    ProductVariantService,
    ImagesService,
  ],
  controllers: [
    AttributeController,
    CategoryController,
    SubCategoryController,
    ProductController,
  ],
})
export class ProductsModule {}
