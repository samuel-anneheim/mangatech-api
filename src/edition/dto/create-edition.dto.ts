import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
/**
 * Class model pour la création d'une édition
 */
export class CreateEditionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  collectionId: number;
}
