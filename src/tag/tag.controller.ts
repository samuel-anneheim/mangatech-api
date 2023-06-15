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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { UpdateResult } from 'typeorm';
import { RolesGuard } from '../auth/role/role.guard';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { Role } from '../auth/role/role.enum';
import { Roles } from '../auth/role/roles.decorator';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * La fonction prend un objet CreateTagDto comme paramètre et renvoie une promesse d'un objet Tag
   * @param {CreateTagDto} createTagDto - Il s'agit du DTO que nous avons créé précédemment.
   * @returns Une promesse d'étiquette
   */
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  /**
   * Une méthode qui renvoie toutes les tags
   * @returns Un tableau d'objets Tag
   */
  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  /**
   * Une méthode qui renvoie toutes les tags
   * @returns Un tableau d'objets Tag
   */
  @Get('/countCollection')
  findAllWithCountCollection(): Promise<Tag[]> {
    return this.tagService.findAllWithCountCollection();
  }

  /**
   * Rechercher toutes les tags et leurs collections associées.
   * La fonction s'appelle findAllWithCollections() et renvoie une promesse d'un tableau d'objets Tag.
   * @returns Un tableau d'objets Tag.
   */
  @Get('/collections')
  findAllWithCollections(): Promise<Tag[]> {
    return this.tagService.findAllWithCollections();
  }

  /**
   * Trouver un Tag par son identifiant.
   * @param {string} id - L'identifiant du tag que nous voulons trouver.
   * @returns Un objet Tag avec la propriété collections renseignée.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag> {
    return this.tagService.findOne(+id);
  }

  /**
   * Trouver un Tag par son identifiant et le renvoyer avec ses collections.
   * @param {string} id - L'identifiant du tag que nous voulons trouver.
   * @returns Un objet Tag avec la propriété collections renseignée.
   */
  @Get(':id/collections')
  findOneWithCollections(@Param('id') id: string): Promise<Tag> {
    return this.tagService.findOneWithCollections(+id);
  }

  /**
   * Met à jour un tag grace à son ID.
   * @param {string} id - ID du tag à mettre à jour.
   * @param {UpdateTagDto} updateTagDto - Il s'agit du DTO.
   * @returns UpdateResult
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<UpdateResult> {
    return this.tagService.update(+id, updateTagDto);
  }

  /**
   * Il prend un paramètre id et renvoie une promesse d'un tag supprimé
   * @param {string} id - L'identifiant de la balise à supprimer.
   * @returns objet Tag.
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<Tag> {
    return this.tagService.remove(+id);
  }
}
