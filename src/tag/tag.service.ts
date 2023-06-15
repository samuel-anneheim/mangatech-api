import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  /**
   * Trouvez tout les tag et renvoyez-les sous la forme d'un tableau d'objets Tag.
   *
   * @returns Un tableau d'objets Tag
   */
  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findAllWithCountCollection(): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.collectionsCount', 'tag.collections')
      .getMany();
  }

  /**
   * Trouvez tous les tags et rejoignez-les avec leurs collections.
   *
   * @returns Un tableau d'objets Tag avec leurs collections.
   */
  async findAllWithCollections(): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.collections', 'collection')
      .getMany();
  }

  /**
   * Trouvez un tag par son id, et si il n'existe pas, lancez un NotFoundException.
   *
   * @param {number} id - number - L'id de la balise que nous voulons trouver.
   * @returns Un objet Tag
   */
  async findOne(id: number): Promise<Tag> {
    const result: Tag = await this.tagRepository.findOneBy({ id });
    if (result === null) throw new NotFoundException();
    return result;
  }

  /**
   * Trouvez un tag par id, et si il existe, renvoyez-la avec ses collections.
   *
   * @param {number} id - number - l'id du tag que nous voulons trouver
   * @returns Un objet Tag avec ses collections.
   */
  async findOneWithCollections(id: number): Promise<Tag> {
    const result: Tag = await this.tagRepository
      .createQueryBuilder('tag')
      .where({ id })
      .leftJoinAndSelect('tag.collections', 'collection')
      .getOne();
    if (result === null) throw new NotFoundException();
    return result;
  }

  /**
   * crée un nouveau tag à l'aide de l'objet de transfert de données (DTO) et l'enregistre dans
   * la base de données
   * @param {CreateTagDto} createTagDto - CreateTagDto - Il s'agit du DTO
   * @returns Un objet Tag
   */
  create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const tag: Tag = this.tagRepository.create(createTagDto);
      const createdTag = this.tagRepository.save(tag);
      return createdTag;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Il met à jour un tag avec l'id donné et renvoie le nombre de lignes affectées
   *
   * @param {number} id - number - L'id du tag que nous voulons mettre à jour.
   * @param {UpdateTagDto} updateTagDto - UpdateTagDto
   * @returns UpdateResult
   */
  async update(id: number, updateTagDto: UpdateTagDto): Promise<UpdateResult> {
    const updateTag: UpdateResult = await this.tagRepository.update(
      { id },
      updateTagDto,
    );
    if (updateTag.affected === 0) {
      throw new NotFoundException();
    }
    return updateTag;
  }

  /**
   * Trouvez tag par id, puis supprimez-la.
   * @param {number} id - number - L'id du tag que nous voulons supprimer.
   * @returns Le tag qui a été supprimée.
   */
  async remove(id: number): Promise<Tag> {
    const tag: Tag = await this.findOne(id);
    return await this.tagRepository.remove(tag);
  }
}
