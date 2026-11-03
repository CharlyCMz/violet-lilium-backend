import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from '../entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationService } from './location.service';
import { CreateAddressDTO, UpdateAddressDTO } from '../dtos/address.dto';
import { Person } from '../entities/person.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private locationService: LocationService,
  ) {}

  async findAll() {
    return await this.addressRepository.find({
      relations: ['location'],
    });
  }

  async findOne(id: string) {
    const address = await this.addressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.person', 'person')
      .leftJoinAndSelect('address.location', 'location')
      .where('address.id = :id', { id })
      .getOne();
    if (!address) {
      throw new NotFoundException(`The Address with ID: ${id} was Not Found`);
    }
    return address;
  }

  async createEntity(payload: CreateAddressDTO) {
    const newAddress = this.addressRepository.create(payload);
    const location = await this.locationService.findOne(payload.locationId);
    if (payload.personId) {
      const person = await this.personRepository.findOneBy({
        id: payload.personId,
      });
      if (person) {
        newAddress.person = person;
      }
    }
    newAddress.location = location;
    return this.addressRepository.save(newAddress);
  }

  async updateEntity(id: string, payload: UpdateAddressDTO) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) {
      throw new NotFoundException(`The Address with ID: ${id} was Not Found`);
    }
    if (payload.locationId) {
      const location = await this.locationService.findOne(payload.locationId);
      address.location = location;
    }
    this.addressRepository.merge(address, payload);
    return this.addressRepository.save(address);
  }

  async deleteEntity(id: string) {
    const exist = await this.addressRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Address with ID: ${id} was Not Found`);
    }
    return this.addressRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.addressRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Address with ID: ${id} was Not Found`);
    }
    return this.addressRepository.delete(id);
  }
}
