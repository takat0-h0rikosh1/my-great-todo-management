import { HttpException, HttpStatus } from '@nestjs/common';

export default class EntityNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Not found entity. id: ${id}`, HttpStatus.NOT_FOUND);
    this.name = 'EntityNotFoundException';
  }
}
