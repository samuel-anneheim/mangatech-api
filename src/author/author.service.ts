import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(@InjectRepository(Author) private repo: Repository<Author>) {}
  /**
   * Listing de toutes les autheurs avec les collections auquelles ils sont lié.
   * @returns
   */
  async findAllWithCollections(): Promise<Author[]> {
    try {
      const result = await this.repo.find({ relations: ['collections'] });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }
  /**
   *
   * @param createAuthorDto Création d'un Autheur.
   * @returns
   */
  create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    try {
      const author = this.repo.create(createAuthorDto);
      const createdAuhtor = this.repo.save(author);
      return createdAuhtor;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Listing de tout les Autheurs.
   * @returns
   */
  findAll(): Promise<Author[]> {
    try {
      const result = this.repo.find();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Trouver une Autheur par son id.
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Author> {
    try {
      const result: Author = await this.repo.findOneBy({ id });
      if (result === null) {
        throw new NotFoundException('Author not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Mise à jours d'un autheur.
   * @param id
   * @param updateAuthorDto
   * @returns
   */
  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    try {
      const author = await this.findOne(id);
      const name =
        updateAuthorDto.name && updateAuthorDto.name !== author.name
          ? updateAuthorDto.name.trim().toLowerCase().replace(/\s/g, '-')
          : author.name.trim().toLowerCase().replace(/\s/g, '-');
      const surname =
        updateAuthorDto.surname && updateAuthorDto.surname !== author.surname
          ? updateAuthorDto.surname.trim().toLowerCase().replace(/\s/g, '-')
          : author.surname.trim().toLowerCase().replace(/\s/g, '-');
      author.slug = `${name}-${surname}`;
      const formatedAuthor: Author = this.repo.create(
        Object.assign(author, updateAuthorDto),
      );
      const updatedVolume = this.repo.save(formatedAuthor);
      return updatedVolume;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Supprimer un autheur.
   * @param id
   * @returns
   */
  async remove(id: number): Promise<string> {
    const author: Author = await this.repo.findOneBy({ id });
    try {
      await this.repo.remove(author);
      return `Auhtor ${id} deleted with success`;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Trouver un autheur par l'id avec les collections auquelles il est lié.
   * @param id
   * @returns
   */
  async findOneByIdWithCollections(id: number): Promise<Author> {
    try {
      const result: Author = await this.repo.findOne({
        relations: ['collections'],
        where: { id },
      });
      if (result === null) throw new NotFoundException('Author Not Found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Trouver un autheur par l'id avec les collections auquelles il est lié.
   * @param id
   * @returns
   */
  async findOneBySlugWithCollections(slug: string): Promise<Author> {
    try {
      const result: Author = await this.repo.findOne({
        relations: ['collections'],
        where: { slug },
      });
      if (result === null) throw new NotFoundException('Author Not Found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }
}
