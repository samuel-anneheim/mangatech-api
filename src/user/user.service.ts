import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LibraryService } from '../library/library.service';
import { UpdateUserDtoAdmin } from './dto/update-user.dtoAdmin';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => LibraryService))
    private readonly libraryService: LibraryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user: User = this.userRepository.create(createUserDto);
      const createdUser: User = await this.userRepository.save(user);
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result: User[] = await this.userRepository.find();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(Error);
    }
  }

  async findOneWithAllRelations(id: number): Promise<User> {
    try {
      const result = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .innerJoinAndMapMany('volumeId', 'library', 'libraries')
        .getOne();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Récupération de l'utilisateur avec les volumes qui compose sa wish list et sa librarie
   * @param id
   * @returns
   */
  async findOneWithWishListAndLibrariesVolumes(id: number): Promise<User> {
    try {
      const result: User = await this.userRepository.findOne({
        where: { id },
        relations: [
          'wishList.edition.collection',
          'libraries.volume.edition.collection',
        ],
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const result: User = await this.userRepository.findOneBy({ id });
      if (result === null) throw new NotFoundException('User not found');
      return result;
    } catch (error) {}
  }

  async findOneWithWishList(id: number) {
    try {
      const result: User = await this.userRepository.findOne({
        where: { id },
        relations: ['wishList'],
      });
      if (result === null) throw new NotFoundException('User not found');
      return result;
    } catch (error) {}
  }

  async findOneByEmail(email: string) {
    try {
      const result: User = await this.userRepository.findOneBy({ email });
      if (result === null) throw new NotFoundException('User not found');
      return result;
    } catch (error) {}
  }

  async update(id: number, updateUserDto: UpdateUserDtoAdmin | UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const formatedUser = this.userRepository.create(
        Object.assign(user, updateUserDto),
      );
      const updatedUser = this.userRepository.save(formatedUser);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    const user: User = await this.findOneWithWishListAndLibrariesVolumes(id);
    const libraries = user.libraries;
    try {
      libraries.forEach((library) => {
        this.libraryService.remove(library.id, user.id);
      });
      await this.userRepository.remove(user);
      return `User ${id} deleted with success`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async save(user: User) {
    try {
      const res = this.userRepository.save(user);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Methode poru savoir si le volume fait parti de la wish list de l"utilisateur
   * @param userId
   * @param volumeId
   * @returns
   */
  async volumeInWishList(volumeId: number, userId: number): Promise<boolean> {
    const res = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.wishList', 'wl')
      .where('user.id = :userid', { userid: userId })
      .andWhere('wl.id = :volumeid', { volumeid: volumeId })
      .getOne();

    if (res == null) {
      return false;
    } else {
      return true;
    }
  }
}
