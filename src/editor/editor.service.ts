import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEditorDto } from './dto/create-editor.dto';
import { UpdateEditorDto } from './dto/update-editor.dto';
import { Editor } from './entities/editor.entity';

@Injectable()
export class EditorService {
  constructor(
    @InjectRepository(Editor)
    private editorRepository: Repository<Editor>,
  ) {}

  /**
   * Il crée un nouvel éditeur à l'aide de l'objet de transfert de données (DTO) et l'enregistre dans la
   * base de données
   *
   * @param {CreateEditorDto} createEditorDto - CreateEditorDto
   * @returns Une promesse d'éditeur
   */
  async create(createEditorDto: CreateEditorDto): Promise<Editor> {
    try {
      const editor = this.editorRepository.create(createEditorDto);
      const createdEditor = await this.editorRepository.save(editor);
      return createdEditor;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Il renvoie une promesse d'un tableau d'objets Editor
   *
   * @returns Un tableau d'objets Editor
   */
  async findAll(): Promise<Editor[]> {
    return await this.editorRepository.find();
  }
  /**
   * Trouvez tous les éditeurs et renvoyez-les avec leurs collections.
   *
   * @returns Un tableau d'objets Editor avec leurs collections.
   */
  async findAllWithCollections(): Promise<Editor[]> {
    return await this.editorRepository.find({ relations: ['collections'] });
  }

  async findAllWithCountCollection(): Promise<Editor[]> {
    return await this.editorRepository
      .createQueryBuilder('editor')
      .loadRelationCountAndMap('editor.countCollections', 'editor.collections')
      .getMany();
  }

  /**
   * Il trouve un éditeur par identifiant, et s'il n'en trouve pas, il génère une erreur
   *
   * @param {number} id - number - L'identifiant de l'éditeur que nous voulons trouver
   * @returns Une promesse d'éditeur
   */
  async findOne(id: number): Promise<Editor> {
    const result: Editor = await this.editorRepository.findOneBy({ id });
    if (result === null) throw new NotFoundException('Editor not found');
    return result;
  }

  /**
   * "Trouvez un éditeur par identifiant et renvoyez-le avec ses collections."
   *
   * @param {number} id - number - l'identifiant de l'éditeur que nous voulons trouver
   * @returns L'éditeur avec l'identifiant donné et toutes ses collections.
   */
  async findOneWithCollections(id: number): Promise<Editor> {
    const result: Editor = await this.editorRepository.findOne({
      relations: ['collections'],
      where: { id },
    });
    if (result === null) throw new NotFoundException('Editor not found');
    return result;
  }

  /**
   * "Trouvez un éditeur par identifiant et renvoyez-le avec ses collections."
   *
   * @param {string} slug - slug - le slug de l'éditeur que nous voulons trouver
   * @returns L'éditeur avec l'identifiant donné et toutes ses collections.
   */
  async findOneWithCollectionsBySlug(slug: string): Promise<Editor> {
    const result: Editor = await this.editorRepository.findOne({
      relations: ['collections'],
      where: { slug },
    });
    if (result === null) throw new NotFoundException('Editor not found');
    return result;
  }

  /**
   * Il met à jour un éditeur par identifiant, en utilisant les données de l'objet UpdateEditorDto
   *
   * @param {number} id - number - L'identifiant de l'éditeur que nous voulons mettre à jour.
   * @param {UpdateEditorDto} updateEditorDto - UpdateEditorDto
   * @returns Editeur mis à jour
   */
  async update(id: number, updateEditorDto: UpdateEditorDto): Promise<Editor> {
    try {
      const editor: Editor = await this.findOne(id);
      updateEditorDto.slug =
        updateEditorDto.name && updateEditorDto.name !== editor.name
          ? updateEditorDto.name.toLowerCase().replace(/ /g, '-')
          : editor.slug;
      const formatedEditor: Editor = this.editorRepository.create(
        Object.assign(editor, updateEditorDto),
      );
      const updateEditor: Editor = await this.editorRepository.save(
        formatedEditor,
      );
      return updateEditor;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.sqlMessage);
    }
  }

  /**
   * Il trouve un éditeur par identifiant, puis le supprime
   *
   * @param {number} id - number - l'identifiant de l'éditeur à supprimer
   * @returns L'éditeur qui a été supprimé.
   */
  async remove(id: number): Promise<Editor> {
    const editor: Editor = await this.findOne(id);
    return await this.editorRepository.remove(editor);
  }
}
