import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import EntityNotFoundException from './entity.not-found.exception';

@Catch(EntityNotFoundException)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
