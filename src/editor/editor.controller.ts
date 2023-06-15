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
import { EditorService } from './editor.service';
import { CreateEditorDto } from './dto/create-editor.dto';
import { UpdateEditorDto } from './dto/update-editor.dto';
import { Editor } from './entities/editor.entity';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  /**
   * La fonction create prend un objet CreateEditorDto comme paramètre et renvoie une promesse d'un objet
   * Editor
   * @param {CreateEditorDto} createEditorDto - Il s'agit du DTO.
   * @returns Une promesse d'un objet Editor.
   */
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createEditorDto: CreateEditorDto): Promise<Editor> {
    return this.editorService.create(createEditorDto);
  }

  /**
   * trouver tous les `editor`.
   * @returns Tableau d'bject des `editor`.
   */
  @Get()
  findAll(): Promise<Editor[]> {
    return this.editorService.findAll();
  }

  /**
   * trouver tous les `editor` avec leurs collections.
   * @returns Tableau d'bject des `editor` avec les collections liées.
   */
  @Get('/collections')
  async findAllWithCollections(): Promise<Editor[]> {
    return await this.editorService.findAllWithCollections();
  }

  @Get('/countCollections')
  async countCollections(): Promise<Editor[]> {
    return await this.editorService.findAllWithCountCollection();
  }

  /**
   * renvoie un `editor`.
   * @param {string} id - Nom du paramètre dans l'URL.
   * @returns Object d'un `editor`.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Editor> {
    return this.editorService.findOne(+id);
  }

  /**
   * renvoie `editor` avec ses `collections`.
   * @param {string} id - id d'un `editor`
   * @returns Object d'un `editor` avec les collections liées.
   */
  @Get(':id/collections')
  findOneWithCollections(@Param('id') id: number): Promise<Editor> {
    return this.editorService.findOneWithCollections(+id);
  }

  /**
   * renvoie `editor` avec ses `collections`.
   * @param {string} slug - slug d'un `editor`
   * @returns Object d'un `editor` avec les collections liées.
   */
  @Get(':slug/slug/collections')
  findOneWithCollectionsBySlug(@Param('slug') slug: string): Promise<Editor> {
    return this.editorService.findOneWithCollectionsBySlug(slug);
  }

  /**
   * Mise à jour de `editor`.
   * @param {string} id - L'identifiant de l'éditeur à mettre à jour.
   * @param {UpdateEditorDto} updateEditorDto - Il s'agit du DTO.
   * @returns UpdateResult
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateEditorDto: UpdateEditorDto,
  ): Promise<Editor> {
    return this.editorService.update(+id, updateEditorDto);
  }

  /**
   * Suppresion d'un `editor` grace à l'`id`.
   * @param {string} id - `ID` de `editor` à supprimer.
   * @returns Une promesse d'un `editor` supprimer
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<Editor> {
    return this.editorService.remove(+id);
  }
}
