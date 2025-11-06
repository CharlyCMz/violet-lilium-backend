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
  providers: [AttributeService],
  controllers: [AttributeController]
})
export class ProductsModule {}
