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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * Route Post création d'une categorie
   * @param createCategoryDto
   * @returns
   */
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Route Get listing de toutes les categories en bdd.
   * @returns
   */
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/countCollection')
  findAllWithCountCollection() {
    return this.categoryService.findAllWithCountCollections();
  }

  /**
   * Route Get listing de toutes les categories en bdd.
   * @returns
   */
  @Get('collections')
  findAllWithCollections() {
    return this.categoryService.findAllWithCollections();
  }
  /**
   * Route Get Recupération d'une categorie par l'id
   * @param id
   * @returns
   */
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.categoryService.findOneById(+id);
  }

  /**
   * Route Get Recupération d'une categorie par l'id
   * @param id
   * @returns
   */
  @Get(':id/collections')
  findOneByIdWithCollections(@Param('id') id: string) {
    return this.categoryService.findOneByIdWithCollections(+id);
  }
  /**
   * Route Patch mise à jours d'une categorie.
   * @param id
   * @param updateCategoryDto
   * @returns
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  /**
   * Route Delete suppression d'une categorie.
   * @param id
   * @returns
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
