import { IsInt, Max, Min } from 'class-validator';

export class Line98MoveDto {
  @IsInt()
  @Min(0)
  @Max(8)
  fromRow: number;

  @IsInt()
  @Min(0)
  @Max(8)
  fromCol: number;

  @IsInt()
  @Min(0)
  @Max(8)
  toRow: number;

  @IsInt()
  @Min(0)
  @Max(8)
  toCol: number;
}
