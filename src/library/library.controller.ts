import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { Role } from '../auth/role/role.enum';
import { Roles } from '../auth/role/roles.decorator';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  /**
   * Route Get , Listing de toutes les bibliotheque d'un utilisateur donné.
   * @param userId id type number
   * @returns Promise<Library[]> : Liste des bibliotheques de l'utilisateur.
   */
  // @Get('user/:id')
  // async findAllLibraryByUserId(@Param('id') id: string): Promise<Library[]> {
  //   return await this.libraryService.findAllLibraryByUserId(+id);
  // }

  /**
   * Route Patch , Mise à jours d'une bibliotheque.
   * @param id id type number
   * @param updateLibraryDto DTO mise à jours d'une bibliotheque.
   * @returns Promise<UpdateResult> la bibliotheque mis à jours
   */
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateLibraryDto: UpdateLibraryDto,
  // ): Promise<Library> {
  //   return this.libraryService.update(+id, updateLibraryDto);
  // }

  /**
   * Route patch pour modifier le status isRead dans la library
   * @param id de la library
   * @returns
   */
  @Patch(':id/changeIsReadStatus')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeIsReadStatus(@Request() req, @Param('id') id: string) {
    return this.libraryService.changeIsReadStatus(+id, req.user.id);
  }

  /**
   * Route Pose , Création d'une bibliotheque
   * @param createLibraryDto DTO de création d'une library
   * @returns Promise<Library> : la biblihoteque crée.
   */
  @Post()
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createLibraryDto: CreateLibraryDto, @Request() req) {
    return this.libraryService.create(createLibraryDto, req.user.id);
  }

  /**
   * Route Get , Listing des bibliotheques.
   * @returns Promise<Library[]> Liste des bibliotheques
   */
  // @Get()
  // findAll() {
  //   return this.libraryService.findAll();
  // }

  /**
   * Route Get , Methode de recherche d'une bibliotheque par son id.
   * @param id id type number
   * @returns Promise<Library> : La bibliotheque trouvée.
   */
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.libraryService.findOne(+id);
  // }

  /**
   * Route Delete , Suppression d'une bibliotheque.
   * @param id id type number
   * @returns Promise<Library> : la bibliotheque supprimer
   */
  @Delete(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.libraryService.remove(+id, req.user.id);
  }
}
