import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { ProductVariant } from './product-variant.entity';

export enum ProductStatus {
  draft = 'Draft',
  published = 'Published',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'brand', nullable: false })
  brand: string;

  @Column({ type: 'text', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.draft })
  status: ProductStatus;

  @Column({ type: 'text', name: 'features', array: true, nullable: true })
  features: string[];

  @Column({ type: 'text', name: 'cautions', array: true, nullable: true })
  cautions: string[];

  @Column({ type: 'int', name: 'views', nullable: false, default: 0 })
  views: number;

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.products)
  @JoinTable({ name: 'products_sub_categories' })
  subCategories: SubCategory[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date | null;
}
