import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { Edition } from '../edition/entities/edition.entity';
import { Tag } from '../tag/entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection) private repo: Repository<Collection>,
    @InjectRepository(Edition) private editionRepo: Repository<Edition>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  /**
   * Recupérers les éditions correspondant au ID envoyés.
   * @param ids ids tableau d'ids
   * @returns Promise<Edition[]> Les editions trouvées.
   */
  async findEidtionsByIds(ids: Array<number>): Promise<Edition[]> {
    try {
      const editionFound: Edition[] = await this.editionRepo.find({
        where: { id: In(ids) },
      });
      return editionFound;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Recupérers les tags correspondant au ID envoyés.
   * @param ids ids tableau d'ids
   * @returns Promise<Tag[]> Les tags trouvées.
   */
  async findTagsByIds(ids: Array<number>): Promise<Tag[]> {
    try {
      const tagsFound: Tag[] = await this.tagRepo.find({
        where: { id: In(ids) },
      });
      return tagsFound;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Listing de toutes les collections avec les data lié a ces collections.
   * @returns Promise<Collection[]> : Les collections trouvées.
   */
  findAllCollectionWithAllDataRelated(): Promise<Collection[]> {
    return this.repo.find({
      relations: ['author', 'editor', 'category', 'editions', 'tags'],
    });
  }

  /**
   * Recherche de la collection par son id avec les data lié a cette collection.
   * @param id id de type number
   * @returns Promise<Collection> : La collection trouvée.
   */
  async findOneCollectionWithAllDataRelated(slug: string): Promise<Collection> {
    const response = await this.repo.findOne({
      relations: [
        'author',
        'editor',
        'category',
        'editions',
        'editions.volumes',
        'tags',
      ],
      where: { slug: slug },
    });
    if (response != null) {
      //récupération des 10 premiers volumes si jamais le nombre des volumes > 10 (à optimiser plus tard)
      response.editions.forEach((edition) => {
        edition.volumesCount = edition.volumes.length;
        if (edition.volumes.length > 7) {
          //trie par numéro de tome et filtre a 10 resultats.
          edition.volumes = edition.volumes
            .sort((a, b) => (a.number > b.number ? 1 : -1))
            .slice(0, 7);
        }
      });
    }
    return response;
  }

  /**
   * Recherche des collections par leur titre avec pagination.
   * @param title titre de la colleciton
   * @param page page cible
   * @param limit limite par page
   * @returns Les collections trouvés , le nombre de pages total
   */
  async findByTitle(title: string, page: number, limit: number): Promise<any> {
    let count = 0;
    try {
      //nombre total de résultats trouvées
      count = await this.repo
        .createQueryBuilder('c')
        .where('c.title like :title', { title: `${title}%` })
        .getCount();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
    //nombre de pages possible
    const nbPages = Math.ceil(count / limit);
    let result: Collection[];
    try {
      //Resultat suite a la recherche
      result = await this.repo
        .createQueryBuilder('c')
        .where('c.title like :title', { title: `${title}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
    const categoriesFound = await this.getAllCategoryLinkedBySearchTitle(title);
    //Donnée formater pour récupérer le numéro de la page avec les résultats
    return result.map((res) => ({
      ...res,
      totalPages: nbPages,
      categoriesFound: categoriesFound,
      count: count,
    }));
  }

  /**
   * Recherche des collections par leur categorie avec pagination.
   * @param categoryName titre de la colleciton
   * @param page page cible
   * @param limit limite par page
   * @returns Les collections trouvés , le nombre de pages total
   */
  async findByCategory(
    categoryName: string,
    page: number,
    limit: number,
  ): Promise<any> {
    let count = 0;
    try {
      //nombre total de résultats trouvées
      count = await this.repo
        .createQueryBuilder('collection')
        .innerJoin('collection.category', 'category')
        .where('category.slug= :slug', { slug: categoryName })
        .getCount();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
    //nombre de pages possible
    const nbPages = Math.ceil(count / limit);

    //Resultat suite a la recherche
    const result = await this.resultWithPaginationForCategory(
      categoryName,
      page,
      limit,
    );
    //Donnée formater pour récupérer le numéro de la page avec les résultats
    return result.map((res) => ({
      ...res,
      totalPages: nbPages,
      count: count,
    }));
  }
  /**
   * Recherche des collections récentes (set a 15 ans de la date d'aujourd'hui pour les test).
   * @returns Promise<Collection> : Les collections trouvées.
   */
  async findCollectionsNewestForHomePage(
    page: number,
    limit: number,
  ): Promise<any> {
    //date du jour
    const currentDate: Date = new Date();
    //date du jour - 15 ans
    const dateYearsAgo: Date = new Date(
      currentDate.getFullYear() - 15,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    let count = 0;
    try {
      //nombre total de résultats trouvées
      count = await this.repo
        .createQueryBuilder('c')
        .orderBy('c.releaseDate', 'DESC')
        .getCount();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }

    page = this.setTargetPage(count, limit, page);

    //Resultats trouvées par rapport a la pagination
    const result = await this.resultWithPaginationForNewestCollection(
      dateYearsAgo,
      currentDate,
      page,
      limit,
    );
    //Donnée formater pour récupérer le numéro de la page avec les résultats
    return result.map((res) => ({
      ...res,
      pageNumber: page,
    }));
  }
  /**
   * Methode privé propore au serice , qui permet de retourner les resultat des collections trouvé par rapport a la pagination pour la homepage partie nouveauté
   * @param dateYearsAgo Date a laquel on veut filtrer (actuellement 15 ans avant la date du jour pour les test)
   * @param currentDate Date du jour
   * @param page page sur laquelle on se situe
   * @param limit limite de resultat par page
   * @returns les collections trouvées.
   */
  private async resultWithPaginationForNewestCollection(
    dateYearsAgo: Date,
    currentDate: Date,
    page: number,
    limit: number,
  ) {
    try {
      return await this.repo
        .createQueryBuilder('c')
        .orderBy('c.releaseDate', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Recherche des collections apres un filtre par categorie appliquer sur une recherche.
   * @returns Promise<Collection> : Les collections trouvées.
   */
  async findCollectionsSearchListFilterByCategory(
    title: string,
    page: number,
    limit: number,
    categoryName: string,
  ): Promise<any> {
    const tabCategoryName: string[] = categoryName.split(',');
    let count: number;
    try {
      //nombre total de résultats trouvées
      count = await this.repo
        .createQueryBuilder('collection')
        .innerJoin('collection.category', 'category')
        .where('category.name IN(:...names)', { names: tabCategoryName })
        .andWhere('collection.title like :title', { title: `${title}%` })
        .getCount();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
    //nombre de pages possible
    const nbPages = Math.ceil(count / limit);

    //Resultats trouvées par rapport a la pagination
    const result = await this.resultWithPaginationForSearchListFilterByCategory(
      title,
      page,
      limit,
      tabCategoryName,
    );
    //Donnée formater pour récupérer le total des pages avec les résultats
    return result.map((res) => ({
      ...res,
      totalPages: nbPages,
      count: count,
    }));
  }
  /**
   * Recherche des collections par category pour le carrousel de la page d'accueil.
   * @returns Promise<Collection> : Les collections trouvées.
   */
  async findCollectionsByCategory(
    page: number,
    limit: number,
    categorySlug: string,
  ): Promise<any> {
    let count = 0;
    try {
      //nombre total de résultats trouvées
      count = await this.repo
        .createQueryBuilder('collection')
        .innerJoin('collection.category', 'category')
        .where('category.slug= :slug', { slug: categorySlug })
        .getCount();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
    page = this.setTargetPage(count, limit, page);

    //Resultats trouvées par rapport a la pagination
    const result = await this.resultWithPaginationForCategory(
      categorySlug,
      page,
      limit,
    );
    //Donnée formater pour récupérer le numéro de la page avec les résultats
    return result.map((res) => ({
      ...res,
      pageNumber: page,
    }));
  }

  /**
   * Methode qui permet de set la page cible pour le carrousel en cas de dépassement d'occurence ou de page en dessous de la page numéro 1
   * @param count le total de page
   * @param limit la limite par page
   * @param page la page cible
   * @returns  la page cible
   */
  private setTargetPage(count: number, limit: number, page: number) {
    //nombre de pages possible
    const nbPages = Math.ceil(count / limit);

    //Si il y'a aucune resultats apres la pagination on revient aux resultats de la page n1 pour le carrousel.
    if (page > nbPages) {
      page = 1;
    }

    //Si l'ont demande la page precedente lorqu'on est sur la premiere page , arrivé sur la derniere page du carrousel.
    else if (page < 1) {
      page = nbPages;
    }
    return page;
  }

  /**
   * Methode pour trouvé la liste des collections correspondant a la category demandée avec pagination.
   * @param categorySlug nom de la category
   * @param page page cible
   * @param limit limite d'affichage
   * @returns Liste de collections paginée par category
   */
  private async resultWithPaginationForCategory(
    categorySlug: string,
    page: number,
    limit: number,
  ) {
    try {
      return await this.repo
        .createQueryBuilder('collection')
        .innerJoin('collection.category', 'category')
        .where('category.slug= :slug', { slug: categorySlug })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * methode qui permet de récupérer toutes les categories lié a la recherche.
   * @param title titre rechercher
   * @returns les categories trouvés.
   */
  private async getAllCategoryLinkedBySearchTitle(title: string) {
    try {
      return await this.categoryRepo
        .createQueryBuilder('category')
        .innerJoin('category.collections', 'collection')
        .select(['category.name'])
        .where('collection.title like :title', { title: `${title}%` })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }
  /**
   * Methode pour trouvé la liste des collections correspondant a la category demandée avec pagination.
   * @param categoryName nom de la category
   * @param page page cible
   * @param limit limite d'affichage
   * @returns Liste de collections paginée par category
   */
  private async resultWithPaginationForSearchListFilterByCategory(
    title: string,
    page: number,
    limit: number,
    tabCategoryName: string[],
  ) {
    try {
      //nombre total de résultats trouvées
      return await this.repo
        .createQueryBuilder('collection')
        .innerJoin('collection.category', 'category')
        .where('category.name IN(:...names)', { names: tabCategoryName })
        .andWhere('collection.title like :title', { title: `${title}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Création d'une collection.
   * @param createCollectionDto DTO de création d'une collection
   * @returns Promise<Collection> : la collection crée.
   */
  async create(
    createCollectionDto: CreateCollectionDto,
    tags: Tag[],
  ): Promise<Collection> {
    try {
      const newCollection: Collection = this.repo.create({
        title: createCollectionDto.title,
        image: createCollectionDto.image,
        releaseDate: createCollectionDto.releaseDate,
        createDate: createCollectionDto.createDate,
        isFinish: createCollectionDto.isFinish,
        visibility: createCollectionDto.visibility,
        resume: createCollectionDto.resume,
        authorId: createCollectionDto.authorId,
        categoryId: createCollectionDto.categoryId,
        editorId: createCollectionDto.editorId,
        tags: tags,
      });
      const createdCollection = await this.repo.save(newCollection);
      return createdCollection;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Listing des collections
   * @returns Promise<Collection[]> : Liste de collections.
   */
  findAll(): Promise<Collection[]> {
    return this.repo.find();
  }

  /**
   * Recherche d'une collection par l'id.
   * @param id id type Number
   * @returns Promise<Collection> : La collection trouvée.
   */
  async findOneAllRelations(id: number): Promise<Collection> {
    const collection = await this.repo.findOne({
      relations: ['tags'],
      where: { id },
    });
    if (collection.tags) {
      const tagsId = [];
      collection.tags.map((tag) => {
        tagsId.push({ id: tag.id });
      });
      collection.tags = tagsId;
    }
    return collection;
  }

  findOne(id: number): Promise<Collection> {
    return this.repo.findOneBy({ id });
  }

  /**
   * Mise à jours d'un collection
   * @param id id type number
   * @param updateCollectionDto DTO mise a jours collection
   * @returns Promise<Collection> : la collection mis à jours.
   */
  async update(
    id: number,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    try {
      const collectionTrouve = await this.findOneAllRelations(id);
      const tags: Tag[] = [];
      if (collectionTrouve.tags) {
        collectionTrouve.tags.map((tag) => {
          tags.push({ id: tag.id } as Tag);
        });
      }
      if (updateCollectionDto.tagsId) {
        updateCollectionDto.tagsId.map((tagId) => {
          tags.push({ id: tagId } as Tag);
        });
      }
      updateCollectionDto.slug =
        updateCollectionDto.title &&
        collectionTrouve.title !== updateCollectionDto.title
          ? updateCollectionDto.title.toLowerCase().replace(/ /g, '-')
          : collectionTrouve.slug;
      const collectionUpdate: Collection = this.repo.create(
        Object.assign(collectionTrouve, updateCollectionDto),
      );
      collectionUpdate.tags = tags;
      const updatedCollection = await this.repo.save(collectionUpdate);
      return updatedCollection;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Suppression d'une collection.
   * @param id id type Number
   * @returns Promise<Collection> : La collection supprimer
   */
  async remove(id: number): Promise<Collection> {
    const suppCollection = await this.repo.findOneBy({ id });
    if (isEmpty(suppCollection)) {
      throw new NotFoundException("La bibliotheque n'a pas été trouvée.");
    }
    return this.repo.remove(suppCollection);
  }
}
