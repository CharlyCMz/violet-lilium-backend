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
import { VariantAttribute } from './entities/variant-attribute.entity';
import { CategoryService } from './services/category.service';
import { SubCategoryService } from './services/sub-category.service';
import { CategoryController } from './controllers/category.controller';
import { SubCategoryController } from './controllers/sub-category.controller';
import { VariantAttributeController } from './controllers/variant-attribute.controller';
import { VariantAttributeService } from './services/variant-attribute.service';

@Module({
   imports: [
    TypeOrmModule.forFeature([
      Attribute,
      Category,
      Image,
      ProductVariant,
      Product,
      VariantAttribute,
      SubCategory,
    ]),
  ],
  providers: [AttributeService, CategoryService, SubCategoryService, VariantAttributeService],
  controllers: [AttributeController, CategoryController, SubCategoryController, VariantAttributeController]
})
export class ProductsModule {}
