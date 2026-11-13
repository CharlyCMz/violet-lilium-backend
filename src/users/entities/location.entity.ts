import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity({ name: 'locations' })
@Index(['countryCode', 'stateCode', 'cityCode'], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'country_code', type: 'varchar', length: 16 })
  countryCode: string;

  @Column({ name: 'country_name', type: 'varchar', length: 128 })
  countryName: string;

  @Column({ name: 'state_code', type: 'varchar', length: 16 })
  stateCode: string;

  @Column({ name: 'state_name', type: 'varchar', length: 128 })
  stateName: string;

  @Column({ name: 'city_code', type: 'varchar', length: 16 })
  cityCode: string;

  @Column({ name: 'city_name', type: 'varchar', length: 128 })
  cityName: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Address, (address) => address.location)
  addresses: Address[];

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
