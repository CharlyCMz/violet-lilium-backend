import { Injectable, NotFoundException } from '@nestjs/common';
import { Location } from '../entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateLocationDTO,
  RejectedLocationDTO,
  UpdateLocationDTO,
} from '../dtos/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  findAll(stateName?: string) {
    return this.locationRepository.find({
      where: stateName ? { stateName } : {},
    });
  }

  async findAllStates() {
    return await this.locationRepository
      .createQueryBuilder('location')
      .select('DISTINCT location.stateName', 'stateName')
      .orderBy('location.stateName', 'ASC')
      .getRawMany<{ stateName: string }>()
      .then((results) => results.map((result) => result.stateName));
  }

  async findOne(id: string) {
    const location = await this.locationRepository
      .createQueryBuilder('location')
      .where('location.id = :id', { id })
      .getOne();
    if (!location) {
      throw new NotFoundException(`The Location with ID: ${id} was Not Found`);
    }
    return location;
  }

  createEntity(payload: CreateLocationDTO) {
    const newLocation = this.locationRepository.create(payload);
    return this.locationRepository.save(newLocation);
  }

  async updateEntity(id: string, payload: UpdateLocationDTO) {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`The Location with ID: ${id} was Not Found`);
    }
    this.locationRepository.merge(location, payload);
    return this.locationRepository.save(location);
  }

  async deleteEntity(id: string) {
    const exist = await this.locationRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Location with ID: ${id} was Not Found`);
    }
    return this.locationRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.locationRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Location with ID: ${id} was Not Found`);
    }
    return this.locationRepository.delete(id);
  }

  async massiveUpload(payload: CreateLocationDTO[]) {
    const processedLocations: Location[] = [];
    const rejectedLocations: RejectedLocationDTO[] = [];

    for (const location of payload) {
      try {
        const newLocation = await this.locationRepository.save(location);
        processedLocations.push(newLocation);
      } catch (error) {
        rejectedLocations.push({
          location: location,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    return {
      total: payload.length,
      processed: processedLocations.length,
      rejected: rejectedLocations.length,
      rejectedProducts: rejectedLocations,
    };
  }
}
