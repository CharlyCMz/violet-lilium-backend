import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

const PG_UNIQUE_VIOLATION = '23505';

interface PostgresDriverError {
  code?: string;
  detail?: string;
}

@Catch(QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const driverError = (
      exception as QueryFailedError & {
        driverError?: PostgresDriverError;
      }
    ).driverError;

    if (driverError?.code !== PG_UNIQUE_VIOLATION) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
      return;
    }

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      message: this.buildMessage(driverError.detail),
    });
  }

  private buildMessage(detail?: string): string {
    if (!detail) {
      return 'A record with this data already exists';
    }
    const match = /Key \(([^)]+)\)=\((.+)\) already exists/.exec(detail);
    if (!match) {
      return 'A record with this data already exists';
    }
    const [, columns, values] = match;
    return `The value (${values}) for (${columns}) already exists`;
  }
}
