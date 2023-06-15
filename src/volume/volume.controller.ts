import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { VolumeService } from './volume.service';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/authStrategy/jwt-auth.guards';
import { RolesGuard } from '../auth/role/role.guard';
import { Volume } from './entities/volume.entity';

@Controller('volume')
export class VolumeController {
  constructor(private readonly volumeService: VolumeService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createVolumeDto: CreateVolumeDto) {
    return this.volumeService.create(createVolumeDto);
  }

  @Patch(':idVolume/wishlist')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addVolumeInUserWishList(
    @Request() req,
    @Param('idVolume', ParseIntPipe) volumeId: number,
  ) {
    return this.volumeService.addVolumeInUserWishList(+volumeId, +req.user.id);
  }

  @Delete(':idVolume/wishlist')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteVolumeInUserWishList(
    @Request() req,
    @Param('idVolume', ParseIntPipe) volumeId: number,
  ) {
    return this.volumeService.deleteVolumeInUserWishList(
      +volumeId,
      +req.user.id,
    );
  }
  @Get()
  findAll() {
    return this.volumeService.findAll();
  }

  /**
   * Route Get Recupération des volumes par edition
   * @param id id de l'edition
   * @param page page ciblée
   * @param limit limit de resultat par page
   * @returns les volumes trouvées.
   */
  @Get('edition/:slugCollection/:slugEdition')
  async findAllByEdition(
    @Param('slugCollection') slugCollection: string,
    @Param('slugEdition') slugEdition: string,
    @Query('pageNumber') page: number,
    @Query('limit') limit: number,
  ): Promise<Volume[]> {
    return await this.volumeService.findAllByEdition(
      slugCollection,
      slugEdition,
      +limit,
      +page,
    );
  }

  @Get('/allData')
  findAllData() {
    return this.volumeService.findAllData();
  }

  @Get('newest')
  async findVolumesNewestForHomePage(): Promise<Volume[]> {
    return await this.volumeService.findVolumesNewestForHomePage();
  }

  @Get('popular')
  async findVolumePopularForHomePage(): Promise<Volume[]> {
    return await this.volumeService.findVolumesPopularForHomePage();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volumeService.findOne(+id);
  }
  /**
   * Route get récupération du volume par le slug de son edition et son numéro de tome
   * @param slug slug de l'edition
   * @param number numéro du tome
   * @returns Volume trouvé
   */
  @Get('edition/:slugCollection/:slugEdition/:number/connected')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOneByEditionAndNumberConnected(
    @Request() req,
    @Param('slugCollection') slugCollection: string,
    @Param('slugEdition') slugEdition: string,
    @Param('number') number: string,
  ) {
    return this.volumeService.findOneByEditionCollectionAndNumber(
      slugCollection,
      slugEdition,
      +number,
      +req.user.id,
    );
  }

  @Get('edition/:slugCollection/:slugEdition/:number')
  findOneByEditionAndNumber(
    @Param('slugCollection') slugCollection: string,
    @Param('slugEdition') slugEdition: string,
    @Param('number') number: string,
  ) {
    return this.volumeService.findOneByEditionCollectionAndNumber(
      slugCollection,
      slugEdition,
      +number,
      null,
    );
  }

  @Get(':id/allRelations')
  findOneWithAllRelations(@Param('id') id: string) {
    return this.volumeService.findOneWithAllData(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateVolumeDto: UpdateVolumeDto) {
    return this.volumeService.update(+id, updateVolumeDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.volumeService.remove(+id);
  }
}
