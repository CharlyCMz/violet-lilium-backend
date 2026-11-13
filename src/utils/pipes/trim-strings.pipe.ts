import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown): unknown {
    return this.trim(value);
  }

  private trim(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (Array.isArray(value)) {
      return value.map((item: unknown) => this.trim(item));
    }
    if (value !== null && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        record[key] = this.trim(record[key]);
      }
      return record;
    }
    return value;
  }
}
