import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  /**
   * Création d'une categorie
   * @param createCategoryDto
   * @returns
   */
  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.repo.create(createCategoryDto);
      const createdCategory = this.repo.save(category);
      return createdCategory;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Listing de toutes les categories.
   * @returns
   */
  findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  async findAllWithCountCollections(): Promise<Category[]> {
    return await this.repo
      .createQueryBuilder('category')
      .loadRelationCountAndMap(
        'category.countCollections',
        'category.collections',
      )
      .getMany();
  }

  /**
   * Listing de toutes les categories avec les collections auquelles elles sont lié.
   * @returns
   */
  async findAllWithCollections(): Promise<Category[]> {
    return this.repo.find({
      relations: ['collections'],
      order: { collections: { releaseDate: 'DESC' } },
    });
  }
  /**
   * Trouver une category par l'id.
   * @param id
   * @returns
   */
  async findOneById(id: number): Promise<Category> {
    const result: Category = await this.repo.findOneBy({ id });
    if (result === null)
      throw new NotFoundException("La catégorie n'existe pas.");
    return result;
  }

  /**
   * Trouver une category par l'id avec les collections auquelles elle est lié.
   * @param id
   * @returns
   */
  async findOneByIdWithCollections(id: number): Promise<Category> {
    const result: Category = await this.repo.findOne({
      relations: ['collections'],
      where: { id },
    });
    if (result === null)
      throw new NotFoundException("La catégorie n'existe pas.");
    return result;
  }
  /**
   * Mise à jours d'une catergorie.
   * @param id
   * @param updateCategoryDto
   * @returns
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category: Category = await this.findOneById(id);
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        category.slug = updateCategoryDto.name
          .trim()
          .toLowerCase()
          .replace(/\s/g, '-');
      }
      const formatedCategory = this.repo.create(
        Object.assign(category, updateCategoryDto),
      );
      const updateCategory: Category = await this.repo.save(formatedCategory);
      return updateCategory;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Suppression d'une categorie
   * @param id
   * @returns
   */
  async remove(id: number): Promise<Category> {
    const categoryAdelete: Category = await this.findOneById(id);
    return await this.repo.remove(categoryAdelete);
  }
}
