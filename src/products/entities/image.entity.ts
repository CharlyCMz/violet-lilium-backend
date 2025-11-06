import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 156, unique: false })
  reference: string;

  @Column({ type: 'boolean', name: 'is_front_image', default: false })
  isFrontImage: boolean;

  @Column({ type: 'varchar', length: 1024, unique: true })
  url: string;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.images)
  productVariant?: ProductVariant;

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
