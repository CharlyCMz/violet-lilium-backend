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
import { ProductVariantController } from './controllers/product-variant.controller';
import { ProductGuideService } from './services/product-guide.service';
import { ProductGuideController } from './controllers/product-guide.controller';
import { ProductGuide } from './entities/product-guide.entity';
import { ImageController } from './controllers/image.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attribute,
      Category,
      Image,
      ProductVariant,
      Product,
      SubCategory,
      ProductGuide
    ]),
  ],
  providers: [
    AttributeService,
    CategoryService,
    SubCategoryService,
    ProductService,
    ProductVariantService,
    ImagesService,
    ProductGuideService,
  ],
  controllers: [
    AttributeController,
    CategoryController,
    SubCategoryController,
    ProductController,
    ProductVariantController,
    ProductGuideController,
    ImageController,
  ],
})
export class ProductsModule {}
