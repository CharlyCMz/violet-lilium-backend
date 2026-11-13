import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from './person.service';
import { RoleService } from './role.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private personService: PersonService,
    private roleService: RoleService,
    private configService: ConfigService,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: ['person', 'role'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new NotFoundException(
        `The User with Username: ${username} was Not Found`,
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('person.mail = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException(
        `The User with Email: ${email} was Not Found`,
      );
    }
    return user;
  }

  async findForAuth(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.person', 'person')
      .where('user.username = :username', { username })
      .getOne();
  }

  async createEntity(payload: CreateUserDTO) {
    const role = await this.roleService.findOne(payload.roleId);
    const person = await this.personService.createEntity(payload.person);
    try {
      const newUser = this.userRepository.create(payload);
      const bcryptRounds =
        this.configService.get<number>('violetLilium.bcryptRounds') ?? 10;
      newUser.password = await bcrypt.hash(payload.password, bcryptRounds);
      newUser.person = person;
      newUser.role = role;
      return await this.userRepository.save(newUser);
    } catch (error) {
      await this.personService.rollbackCreated(person.id);
      throw error;
    }
  }

  async updateEntity(id: string, payload: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    if (payload.username) {
      user.username = payload.username;
    }
    if (payload.password) {
      const bcryptRounds =
        this.configService.get<number>('violetLilium.bcryptRounds') ?? 10;
      user.password = await bcrypt.hash(payload.password, bcryptRounds);
    }
    return this.userRepository.save(user);
  }

  async deleteEntity(id: string) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.softDelete(id);
  }

  async eliminateEntity(id: string) {
    const exist = await this.userRepository.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException(`The User with ID: ${id} was Not Found`);
    }
    return this.userRepository.delete(id);
  }
}
