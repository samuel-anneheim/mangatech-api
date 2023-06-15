import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EditionService } from './edition.service';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { Edition } from './entities/edition.entity';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('edition')
export class EditionController {
  constructor(private readonly editionService: EditionService) {}
  /**
   * Route patch, mise à jours d'une édition
   * @param id id type number
   * @param updateEditionDto DTO de mise à jours d'une édition
   * @returns Promise<UpdateResult> : L'édtion mise à jours
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateEditionDto: UpdateEditionDto,
  ): Promise<Edition> {
    return this.editionService.update(+id, updateEditionDto);
  }

  /**
   * Route Get listing de toutes les editions en bdd.
   * @returns Promise<Edition[]> : La liste des éditions trouvées.
   */
  @Get('collections')
  async findAllWithCollections(): Promise<Edition[]> {
    return await this.editionService.findAllWithCollections();
  }

  /**
   * Route Get Recupération d'une edition par l'id
   * @param id id type number
   * @returns Promise<Edition> : L'édtition trouvée.
   */
  @Get('collections/:id')
  async findOneByIdWithCollections(@Param('id') id: string): Promise<Edition> {
    return await this.editionService.findOneWithCollections(+id);
  }
  /**
   * Route post , création d'une édition.
   * @param createEditionDto DTO de création d'une edition
   * @returns Promise<Edition> : L'édition créer.
   */
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createEditionDto: CreateEditionDto): Promise<Edition> {
    return this.editionService.create(createEditionDto);
  }

  /**
   * Route get, récupération de toutes les éditions.
   * @returns Promise<Edition[]> : Liste des éditions trouvées.
   */
  @Get()
  findAll(): Promise<Edition[]> {
    return this.editionService.findAll();
  }

  /**
   * Route get, récupération d'une édition par son id.
   * @param id id type number
   * @returns Promise<Edition> : L'édition trouvé.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Edition> {
    return this.editionService.findOne(+id);
  }

  /**
   * Route delete , suppresion d'une edition
   * @param id id type number
   * @returns Promise<Edition> : L'édition supprimer.
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<string> {
    return this.editionService.remove(+id);
  }

  @Get('collectionId/:id')
  async findOneByCollectionId(@Param('id') id: string): Promise<Edition[]> {
    return await this.editionService.findEditionByCollectionId(+id);
  }
}
