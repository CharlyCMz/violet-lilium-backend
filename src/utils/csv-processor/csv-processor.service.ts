import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { CreateLocationDTO } from 'src/users/dtos/location.dto';

type CsvRow = Record<string, unknown>;

@Injectable()
export class CsvProcessorService {
  loadDictionary(dictionaryName: string): Record<string, string> {
    const dictionaryPath = path.join(
      __dirname,
      './dictionaries/',
      `${dictionaryName}.dictionary.json`,
    );
    if (!fs.existsSync(dictionaryPath)) {
      throw new Error(`El diccionario ${dictionaryName} no existe.`);
    }
    const data = fs.readFileSync(dictionaryPath, 'utf-8');
    return JSON.parse(data) as Record<string, string>;
  }

  renameHeaders(row: CsvRow, dictionary: Record<string, string>): CsvRow {
    const renamedRow: CsvRow = {};

    const normalizedDictionary: Record<string, string> = {};
    for (const key of Object.keys(dictionary)) {
      normalizedDictionary[key.toLowerCase().trim()] = dictionary[key];
    }

    for (const header of Object.keys(row)) {
      const normalizedHeader = header.toLowerCase().trim();
      const newHeader = normalizedDictionary[normalizedHeader] || header;
      renamedRow[newHeader] = row[header];
    }

    return renamedRow;
  }

  processCsvBuffer(
    buffer: Buffer,
    dictionaryName: 'location',
  ): Promise<CreateLocationDTO[]>;
  processCsvBuffer(buffer: Buffer, dictionaryName: string): Promise<CsvRow[]>;
  processCsvBuffer(
    buffer: Buffer,
    dictionaryName: string,
  ): Promise<CsvRow[] | CreateLocationDTO[]> {
    const stream = Readable.from(buffer);
    const records: (CsvRow | CreateLocationDTO)[] = [];
    const dictionary = this.loadDictionary(dictionaryName);
    return new Promise((resolve, reject) => {
      stream
        .pipe(
          parse({
            columns: true,
            delimiter: [';', ','],
            skipRecordsWithEmptyValues: true,
            trim: true,
          }),
        )
        .on('data', (row: CsvRow) => {
          const renamedRow = this.renameHeaders(row, dictionary);
          switch (dictionaryName) {
            case 'location':
              records.push(this.transformRowToLocation(renamedRow));
              break;
            default:
              records.push(renamedRow);
          }
        })
        .on('error', (error: Error) => {
          reject(error);
        })
        .on('end', () => {
          resolve(records as CreateLocationDTO[] | CsvRow[]);
        });
    });
  }

  transformRowToLocation(row: CsvRow): CreateLocationDTO {
    return {
      cityCode: String(row.cityCode),
      cityName: String(row.city),
      stateCode: String(row.stateCode),
      stateName: String(row.state),
      countryCode: String(row.countryCode).toUpperCase(),
      countryName: String(row.country),
    };
  }
}
