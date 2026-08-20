import { IsInt, Max, Min } from 'class-validator';

export class CaroMoveDto {
  @IsInt()
  @Min(0)
  @Max(14)
  row: number;

  @IsInt()
  @Min(0)
  @Max(14)
  col: number;
}
