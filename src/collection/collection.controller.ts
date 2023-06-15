import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Tag } from '../tag/entities/tag.entity';
import { Collection } from './entities/collection.entity';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  /**
   * Route Get, Listing de toutes les collections avec les data lié a ces collections.
   * @returns Promise<Collection[]> : Les collections trouvées.
   */
  @Get('alldatas')
  findAllCollectionWithAllDataRelated(): Promise<Collection[]> {
    return this.collectionService.findAllCollectionWithAllDataRelated();
  }

  /**
   * Route Get, Recherche de la collection par son id avec les data lié a cette collection.
   * @param id id de type number
   * @returns Promise<Collection> : La collection trouvée.
   */
  @Get(':slug/alldatas')
  findOneCollectionWithAllDataRelated(
    @Param('slug') slug: string,
  ): Promise<Collection> {
    return this.collectionService.findOneCollectionWithAllDataRelated(slug);
  }

  /**
   * Route Post , Création d'une collection.
   * @param createCollectionDto DTO de création d'une collection
   * @returns Promise<Collection> : la collection crée.
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    const tags: Tag[] = await this.collectionService.findTagsByIds(
      createCollectionDto.tagsId,
    );
    return await this.collectionService.create(createCollectionDto, tags);
  }

  /**
   * Route Get, Listing des collections
   * @returns Promise<Collection[]> : Liste de collections.
   */
  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  /**
   * Recherche des collections récente (set a 15 ans de la date d'aujourd'hui pour les test).
   * @returns Promise<Collection> : La collection trouvée.
   */
  @Get('newest')
  async findCollectionsNewestForHomePage(
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
  ): Promise<Collection[]> {
    return this.collectionService.findCollectionsNewestForHomePage(
      page ? page : 1,
      limit,
    );
  }
  /**
   * Recherche des collections correspondantes a la recherche.
   * @param page page cible
   * @param limit limit de resultat
   * @param title titre rechercher
   * @param filterCategoryName filtre categories rechercher
   * @returns
   */
  @Get('search')
  async findByTitle(
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ): Promise<Collection[]> {
    return this.collectionService.findByTitle(title, page, limit);
  }

  /**
   * Recherche des collections correspondantes a la recherche plus le fitre par categorie.
   * @param page page cible
   * @param limit limit de resultat
   * @param title titre rechercher
   * @returns
   */
  @Get('search/filter')
  async findCollectionsSearchListFilterByCategory(
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
    @Query('filterCategoryName') filterCategoryName: string,
  ): Promise<Collection[]> {
    return this.collectionService.findCollectionsSearchListFilterByCategory(
      title,
      page,
      limit,
      filterCategoryName,
    );
  }

  /**
   * Recherche des resultat par categorie
   * @param page page cible
   * @param limit limite de resultat
   * @param categoryName la categorie rechercher
   * @returns
   */
  @Get('categories/search')
  async findByCategory(
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
    @Query('categoryName') categoryName: string,
  ): Promise<Collection[]> {
    return this.collectionService.findByCategory(categoryName, page, limit);
  }

  /**
   * Recherche pour le carrousel categorie Shonen et Seinen
   * @param page page cible
   * @param limit limite de resultat
   * @param categoryName les categories
   * @returns
   */
  @Get('category')
  async findCollectionsByCategory(
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
    @Query('categorySlug') categorySlug: string,
  ): Promise<Collection[]> {
    return this.collectionService.findCollectionsByCategory(
      page ? page : 1,
      limit,
      categorySlug,
    );
  }
  /**
   * Route Get , Recherche d'une collection par l'id.
   * @param id id type Number
   * @returns Promise<Collection> : La collection trouvée.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOneAllRelations(+id);
  }

  /**
   * Route Patch , Mise à jours d'un collection
   * @param id id type number
   * @param updateCollectionDto DTO mise a jours collection
   * @returns Promise<Collection> : la collection mis à jours.
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return await this.collectionService.update(+id, updateCollectionDto);
  }

  /**
   *Route delete, Suppression d'une collection.
   * @param id id type Number
   * @returns Promise<Collection> : La collection supprimer
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.collectionService.remove(+id);
  }
}
