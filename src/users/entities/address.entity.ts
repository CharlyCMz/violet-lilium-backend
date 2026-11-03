import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Person } from './person.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  street: string;

  @Column({ type: 'varchar', length: 64 })
  reference: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  suite: string;

  @Column({ type: 'varchar', name: 'zip_code', length: 8, nullable: true })
  zipCode: string;

  @Column({ name: 'is_billing', type: 'boolean', default: false })
  isBilling: boolean;

  @Column({ name: 'is_shipping', type: 'boolean', default: false })
  isShipping: boolean;

  @ManyToOne(() => Location, (location) => location.addresses)
  location: Location;

  @ManyToOne(() => Person, (person) => person.addresses)
  person: Person;

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
  })
  deletedAt: Date;
}
