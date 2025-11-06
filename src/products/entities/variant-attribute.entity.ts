import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'variants_attributes' })
export class VariantAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 156, unique: false })
  value: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.variantsAttributes)
  attribute: Attribute;

  @ManyToMany(
    () => ProductVariant,
    (productVariant) => productVariant.variantsAttributes,
  )
  productVariants: ProductVariant[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  deletedAt: Date;
}
