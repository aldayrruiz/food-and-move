import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailOrPasswordIncorrect extends HttpException {
  constructor() {
    super('Email o password incorrecta', HttpStatus.BAD_REQUEST);
  }
}
