import { Expose } from 'class-transformer';

export class PlayerDto {
  @Expose()
  name: string;

  @Expose()
  level: number;
}
