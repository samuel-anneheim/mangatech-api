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
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { Role } from '../auth/role/role.enum';
import { RolesGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/role/roles.decorator';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
  /**
   * Route Get listing de toutes les autheur en bdd.
   * @returns
   */
  @Get('collections')
  async findAllWithCollections(): Promise<Author[]> {
    return await this.authorService.findAllWithCollections();
  }

  /**
   * Route Post Création d'un autheur.
   * @param createAuthorDto
   * @returns
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }

  /**
   * Route Get Listing de tout les autheur.
   * @returns
   */
  @Get()
  findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }

  /**
   * Route get Récupération de l'autheur par l'id.
   * @param id
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Author> {
    return this.authorService.findOne(+id);
  }

  /**
   * Route Patch mise à jours d'un autheur.
   * @param id
   * @param updateAuthorDto
   * @returns
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorService.update(+id, updateAuthorDto);
  }

  /**
   * Route Delete Suppression d'un autheur.
   * @param id
   * @returns
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<string> {
    return this.authorService.remove(+id);
  }

  /**
   * Route Get Recupération d'un autheur par l'id
   * @param id
   * @returns
   */
  @Get('collections/:id')
  findOneByIdWithCollections(@Param('id') id: string): Promise<Author> {
    return this.authorService.findOneByIdWithCollections(+id);
  }

  /**
   * Route Get Recupération d'un autheur par le slug
   * @param slug
   * @returns
   */
  @Get('collections/:slug/slug')
  findOneBySlugWithCollections(@Param('slug') slug: string): Promise<Author> {
    return this.authorService.findOneBySlugWithCollections(slug);
  }
}
