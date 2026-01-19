import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product_guides' })
export class ProductGuide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'guide_name', nullable: false })
  guideName: string;

  @Column({ type: 'text', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'text', name: 'short_description', default: '' })
  shortDescription: string;

  @Column({ type: 'text', name: 'tests', array: true, nullable: true })
  tests: string[];

  @Column({ type: 'text', name: 'how_to_use', array: true, nullable: true })
  howToUse: string[];

  @Column({ type: 'text', name: 'expectations', nullable: false })
  expectations: string;

  @Column({ type: 'text', name: 'clean_and_care', array: true, nullable: true })
  cleanAndCare: string[];

  @Column({ type: 'text', name: 'images', array: true, nullable: true })
  images: string[];

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
