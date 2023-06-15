import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { Edition } from './entities/edition.entity';

@Injectable()
export class EditionService {
  constructor(
    @InjectRepository(Edition)
    private repo: Repository<Edition>,
  ) {}

  /**
   * Mise à jours d'une édition
   * @param id id de type number
   * @param updateEditionDto DTO de mise à jours d'une edition
   * @returns Promise<Edition> l'edition mis à jour
   */
  async update(
    id: number,
    updateEditionDto: UpdateEditionDto,
  ): Promise<Edition> {
    try {
      const edition: Edition = await this.findOne(id);
      updateEditionDto.slug =
        updateEditionDto.name && edition.name !== updateEditionDto.name
          ? updateEditionDto.name.toLowerCase().replace(/ /g, '-')
          : edition.slug;
      const formatedEdition: Edition = this.repo.create(
        Object.assign(edition, updateEditionDto),
      );
      const updatedEdition: Edition = await this.repo.save(formatedEdition);
      return updatedEdition;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  /**
   * Trouvez tous les Editions et renvoyez-les avec leurs collections.
   *
   * @returns Un tableau d'objets Editions avec leurs collections.
   */
  async findAllWithCollections(): Promise<Edition[]> {
    try {
      const result: Edition[] = await this.repo.find({
        relations: ['collection'],
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * "Trouvez une edition par identifiant et renvoyez-le avec ses collections."
   *
   * @param {number} id - number - l'identifiant de l'éditeur que nous voulons trouver
   * @returns L'edtion avec l'identifiant donné et toutes ses collections.
   */
  async findOneWithCollections(id: number): Promise<Edition> {
    try {
      const result: Edition = await this.repo.findOne({
        relations: ['collection'],
        where: { id },
      });
      if (result === null) throw new NotFoundException('Edition not found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Methode de création d'une édition.
   * @param createEditionDto DTO d'une edition
   * @returns Promise<Edition> l'édition créer.
   */
  async create(createEditionDto: CreateEditionDto): Promise<Edition> {
    try {
      const edition: Edition = this.repo.create(createEditionDto);
      const createdEdition = await this.repo.save(edition);
      return createdEdition;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findEditionByCollectionId(collectionId: number): Promise<Edition[]> {
    try {
      const result = this.repo.find({ where: { collectionId } });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Listing de toutes les éditions.
   * @returns Promise<Edition[]> les éditions trouvés
   */
  findAll(): Promise<Edition[]> {
    try {
      const result = this.repo.find();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Recupération d'une édition par son id.
   * @param id l'id de type number
   * @returns Promise<Edition> l'edition trouvé
   */
  findOne(id: number): Promise<Edition> {
    try {
      const result = this.repo.findOneBy({ id });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Suppression d'une édition
   * @param id id de type number
   * @returns Promise<Edition> l'édition supprimer.
   */
  async remove(id: number): Promise<string> {
    const edition = await this.repo.findOneBy({ id });
    try {
      await this.repo.remove(edition);
      return `Edition ${id} deleted with success`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
