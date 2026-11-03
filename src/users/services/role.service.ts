import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findAll() {
    return this.roleRepository.find({
      relations: ['users'],
    });
  }

  async findOne(id: string) {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id })
      .getOne();
    if (!role) {
      throw new NotFoundException(`The Role with ID: ${id} was Not Found`);
    }
    return role;
  }

  async createEntity(payload: CreateRoleDTO) {
    const newRole = this.roleRepository.create(payload);
    return await this.roleRepository.save(newRole);
  }

  async updateEntity(id: string, payload: UpdateRoleDTO) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`The Role with ID: ${id} was Not Found`);
    }
    this.roleRepository.merge(role, payload);
    return this.roleRepository.save(role);
  }

  async deleteEntity(id: string) {
    const exist = await this.roleRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Role with ID: ${id} was Not Found`);
    }
    return this.roleRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.roleRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The Role with ID: ${id} was Not Found`);
    }
    return this.roleRepository.delete(id);
  }
}
