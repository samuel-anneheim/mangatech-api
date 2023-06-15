import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryService } from '../library/library.service';
import { Repository } from 'typeorm';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { Volume } from './entities/volume.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class VolumeService {
  constructor(
    @InjectRepository(Volume)
    private volumeRepository: Repository<Volume>,
    @Inject(forwardRef(() => LibraryService))
    private libraryService: LibraryService,
    private userService: UserService,
  ) {}

  /**
   * Création en base de données d'un volume.
   * @param {CreateVolumeDto} createVolumeDto - Objet model qui permet la création d'un volume.
   * @returns Un volume
   */
  async create(createVolumeDto: CreateVolumeDto): Promise<Volume> {
    try {
      const volume: Volume = this.volumeRepository.create(createVolumeDto);
      const createdVolume = await this.volumeRepository.save(volume);
      return createdVolume;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Trouver l'intégralité des volumes.
   * @returns Tableau de volumes
   */
  async findAll(): Promise<Volume[]> {
    try {
      const result = await this.volumeRepository.find();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllData(): Promise<Volume[]> {
    try {
      const result = await this.volumeRepository.find({
        relations: ['edition', 'edition.collection'],
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Trouver l'intégralité des volumes par rapport a une edition avec pagination.
   * @returns Tableau de volumes
   */
  async findAllByEdition(
    slugCollection: string,
    slugEdition: string,
    limit: number,
    page: number,
  ): Promise<any[]> {
    let count = 0;
    try {
      count = await this.volumeRepository.count({
        relations: ['edition.collection'],
        where: {
          edition: {
            slug: slugEdition,
            collection: {
              slug: slugCollection,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }

    //nombre de pages possible
    const nbPages = Math.ceil(count / limit);

    //Resultats trouvées par rapport a la pagination
    const result = await this.resultWithPaginationForVolumes(
      slugCollection,
      slugEdition,
      page,
      limit,
    );
    //Donnée formater pour récupérer le total des pages avec les résultats
    return result.map((res) => ({
      ...res,
      totalPages: nbPages,
      count: count,
    }));
  }
  /**
   * Trouver un volume grâce à son ID.
   * @param {number} id - number - Id du volume.
   * @returns Le volume souhaité en promise.
   */
  async findOne(id: number): Promise<Volume> {
    try {
      const result: Volume = await this.volumeRepository.findOneBy({ id });
      if (result === null) throw new NotFoundException('Volume not found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneWithAllData(id: number): Promise<Volume> {
    try {
      const result: Volume = await this.volumeRepository
        .createQueryBuilder('volume')
        .where({ id: id })
        .innerJoinAndSelect('volume.edition', 'edition')
        .getOne();
      if (result === null) throw new NotFoundException('Volume not found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Trouver un volume grâce à son edition et le numéro du volume.
   * @param {string} slug - string - slug de l'édition.
   * @param {number} number - number - numéro du volume.
   * @returns Le volume souhaité en promise.
   */
  async findOneByEditionCollectionAndNumber(
    slugCollection: string,
    slugEdition: string,
    number: number,
    userId: number,
  ): Promise<any> {
    let count = 0;
    try {
      //nombre total de volume trouvé par edition
      count = await this.volumeRepository.count({
        relations: ['edition.collection'],
        where: {
          edition: {
            slug: slugEdition,
            collection: {
              slug: slugCollection,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }

    //Resultat trouvé
    const res = await this.resultOneVolumeByEditionAndNumber(
      slugCollection,
      slugEdition,
      number,
    );
    res.volumesCount = count;

    //Check du volume s'il fait parti de la library de l'utilsiateur ou non
    const library = await this.libraryService.volumeInLibrary(res.id, userId);
    if (library == null) {
      res.volumeInLibrary = false;
    } else {
      res.volumeInLibrary = library.id;
      res.volumeIsRead = library.isRead;
    }

    //Check si l'utilisateur à le volume dans sa wish list.
    res.volumeInWishList = await this.userService.volumeInWishList(
      res.id,
      userId,
    );

    return res;
  }

  /**
   * Mise à jour d'un volume grace à son ID en base de données, en utilisant l'objet qui lui est fournis.
   * @param {number} id - number - Id du volume à modifier.
   * @param {UpdateVolumeDto} updateVolumeDto - objet qui permet de modifier le volume.
   * @returns Volume mis à jour.
   */
  async update(id: number, updateVolumeDto: UpdateVolumeDto): Promise<Volume> {
    try {
      const volume: Volume = await this.findOne(id);
      updateVolumeDto.slug =
        updateVolumeDto.title && volume.title !== updateVolumeDto.title
          ? updateVolumeDto.title.toLowerCase().replace(/ /g, '-')
          : volume.slug;
      const formatedVolume = this.volumeRepository.create(
        Object.assign(volume, updateVolumeDto),
      );
      const updatedVolume = await this.volumeRepository.save(formatedVolume);
      return updatedVolume;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Cherche un volume en base de données pour pouvoir le supprimer si il existe.
   * @param {number} id - number - id du volume à supprimer
   * @returns Volume supprimé
   */
  async remove(id: number): Promise<string> {
    const volume: Volume = await this.findOne(id);
    try {
      await this.volumeRepository.remove(volume);
      return `Volume ${id} deleted with success`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Methode pour trouvé la liste des volumes correspondant a l'edition demandée avec pagination.
   * @param id id de l'edition
   * @param page page cible
   * @param limit limite d'affichage
   * @returns Liste des volumes paginée par edition
   */
  private async resultWithPaginationForVolumes(
    slugCollection: string,
    slugEdition: string,
    page: number,
    limit: number,
  ) {
    try {
      return await this.volumeRepository.find({
        relations: [
          'edition.collection',
          'edition.collection.editor',
          'edition.collection.author',
        ],
        where: {
          edition: {
            slug: slugEdition,
            collection: {
              slug: slugCollection,
            },
          },
        },
        order: {
          number: 'ASC',
        },
        take: limit,
        skip: (page - 1) * limit,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Methode pour trouvé la liste des volumes correspondant a l'edition demandée avec pagination.
   * @param id id de l'edition
   * @param page page cible
   * @param limit limite d'affichage
   * @returns Liste des volumes paginée par edition
   */
  private async resultOneVolumeByEditionAndNumber(
    slugCollection: string,
    slugEdition: string,
    number: number,
  ) {
    try {
      return await this.volumeRepository.findOne({
        relations: [
          'edition.collection',
          'edition.collection.editor',
          'edition.collection.author',
        ],
        where: {
          number: number,
          edition: {
            slug: slugEdition,
            collection: {
              slug: slugCollection,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Ajouter un volume dans la wish list de l'utilisateur courant
   * @param volumeId
   * @param userId
   */
  async addVolumeInUserWishList(volumeId: number, userId: number) {
    const user = await this.userService.findOneWithWishList(userId);
    const volume = await this.findOne(volumeId);
    user.wishList.push(volume);
    return await this.userService.save(user);
  }

  /**
   * Supprimer un volume dans la wish list de l'utilisateur courant
   * @param volumeId
   * @param userId
   */
  async deleteVolumeInUserWishList(volumeId: number, userId: number) {
    const user = await this.userService.findOneWithWishList(userId);
    user.wishList = user.wishList.filter((volume) => {
      return volume.id != volumeId;
    });
    return await this.userService.save(user);
  }

  async save(volume: Volume) {
    try {
      const res = this.volumeRepository.save(volume);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findVolumesNewestForHomePage() {
    try {
      return await this.volumeRepository
        .createQueryBuilder('volume')
        .innerJoinAndSelect('volume.edition', 'edition')
        .innerJoinAndSelect('edition.collection', 'collection')
        .innerJoinAndSelect('collection.editor', 'editor')
        .innerJoinAndSelect('collection.author', 'author')
        .orderBy('volume.releaseDate', 'DESC')
        .limit(30)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  async findVolumesPopularForHomePage() {
    try {
      return await this.volumeRepository
        .createQueryBuilder('volume')
        .innerJoinAndSelect('volume.edition', 'edition')
        .innerJoinAndSelect('edition.collection', 'collection')
        .innerJoinAndSelect('collection.editor', 'editor')
        .innerJoinAndSelect('collection.author', 'author')
        .orderBy('volume.followNumber', 'DESC')
        .limit(30)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }
}
