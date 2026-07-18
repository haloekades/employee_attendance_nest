import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class FindOrderQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    // 1. If it's a string that looks like a JSON array "[2,3]", parse it safely
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        return []; // Fallback if JSON parsing fails
      }
    }

    // 2. Standardize into an array of integers
    const array = Array.isArray(value) ? value : [value];
    return array.map((item) => parseInt(item, 10)).filter((item) => !isNaN(item));
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(5, { each: true })
  statuses?: number[];
}
