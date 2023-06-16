import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class OwnerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const jwt = req.headers.authorization?.split(' ')[1];
    const payload = jwt?.split('.')[1];
    const decodedPayload = Buffer.from(payload || '', 'base64').toString('utf-8');
    const parsedPayload = JSON.parse(decodedPayload);
    req.body.owner = parsedPayload?.id;
    next();
  }
}
