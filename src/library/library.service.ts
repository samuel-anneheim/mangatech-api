import {
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Library } from './entities/library.entity';
import { VolumeService } from '../volume/volume.service';
import { Volume } from '../volume/entities/volume.entity';
import { Inject } from '@nestjs/common/decorators';
@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    private userService: UserService,
    @Inject(forwardRef(() => VolumeService))
    private volumeService: VolumeService,
  ) {}

  /**
   * Listing de toutes les bibliotheque d'un utilisateur donné.
   * @param userId id type number
   * @returns Promise<Library[]> : Liste des bibliotheques de l'utilisateur.
   */
  async findAllLibraryByUserId(userId: number): Promise<Library[]> {
    try {
      const result: Library[] = await this.libraryRepository.find({
        relations: ['volume'],
        where: {
          user: {
            id: userId,
          },
        },
      });
      if (result == null || result.length == 0)
        throw new NotFoundException(
          'library not found with this user: ' + userId + '.',
        );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Création d'une bibliotheque
   * @param createLibraryDto DTO de création d'une library
   * @returns Promise<Library> : la biblihoteque crée.
   */
  async create(
    createLibraryDto: CreateLibraryDto,
    userId: number,
  ): Promise<Library> {
    try {
      const newlibrary = Object.assign(createLibraryDto, { userId: userId });
      const library: Library = this.libraryRepository.create(newlibrary);
      const volume: Volume = await this.volumeService.findOne(
        +createLibraryDto.volumeId,
      );
      const user = await this.userService.findOneWithWishList(+userId);
      volume.followNumber = volume.followNumber + 1;
      user.countVolume = user.countVolume + 1;
      await this.volumeService.save(volume);
      await this.userService.save(user);
      const createdLibrary = await this.libraryRepository.save(library);
      return createdLibrary;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Listing des bibliotheques.
   * @returns Promise<Library[]> Liste des bibliotheques
   */
  async findAll(): Promise<Library[]> {
    try {
      const result = await this.libraryRepository.find();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Methode de recherche d'une bibliotheque par son id.
   * @param id id type number
   * @returns Promise<Library> : La bibliotheque trouvée.
   */
  findOne(id: number): Promise<Library> {
    try {
      const result = this.libraryRepository.findOneBy({ id });
      if (result === null) throw new NotFoundException('Library not found');
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Mise à jours d'une bibliotheque.
   * @param id id type number
   * @param updateLibraryDto DTO mise à jours d'une bibliotheque.
   * @returns Promise<UpdateResult> la bibliotheque mis à jours
   */
  async update(
    id: number,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    try {
      const library: Library = await this.findOne(id);
      const updatedLibrary = this.libraryRepository.create(
        Object.assign(library, updateLibraryDto),
      );
      return this.libraryRepository.save(updatedLibrary);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Suppression d'une bibliotheque.
   * @param id id type number
   * @returns Promise<Library> : la bibliotheque supprimer
   */
  async remove(id: number, userId: number): Promise<string> {
    try {
      const library = await this.findOne(id);
      if (library.userId !== userId) {
        throw new UnauthorizedException();
      }
      const volume: Volume = await this.volumeService.findOne(library.volumeId);
      const user = await this.userService.findOneWithWishList(userId);
      if (library.isRead) {
        user.countVolumeRead = user.countVolumeRead - 1;
      }
      volume.followNumber = volume.followNumber - 1;
      user.countVolume = user.countVolume - 1;
      await this.volumeService.save(volume);
      await this.userService.save(user);
      await this.libraryRepository.remove(library);
      return `Library ${id} deleted with success`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Methode qui permet de savoir si l'utilsateur a le volume dans sa biblotheque
   * @param idvolume
   * @param idUser
   * @returns
   */
  async volumeInLibrary(idvolume: number, idUser: number): Promise<Library> {
    //Voir si le volume est ajouté dans la bibliotheque de l'utilisateur courant
    return await this.libraryRepository
      .createQueryBuilder('library')
      .where('library.userId = :iduser', { iduser: idUser })
      .andWhere('library.volumeId = :idvolume', { idvolume: idvolume })
      .getOne();
  }

  /**
   * Changement du status lu / non lu d'une library par rapport a son ID
   * @param id
   * @returns
   */
  async changeIsReadStatus(id: number, userId: number): Promise<Library> {
    const library = await this.libraryRepository.findOne({ where: { id } });
    if (+library.userId !== userId) {
      throw new UnauthorizedException();
    }
    if (library != null) {
      library.isRead = !library.isRead;
      const user = await this.userService.findOne(library.userId);
      if (library.isRead) {
        user.countVolumeRead = user.countVolumeRead + 1;
      } else {
        user.countVolumeRead = user.countVolumeRead - 1;
      }
      await this.userService.save(user);
      return this.libraryRepository.save(library);
    } else {
      throw new InternalServerErrorException();
    }
  }
}
