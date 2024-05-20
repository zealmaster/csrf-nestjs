import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as csrf from 'csrf-tokens';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config()

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfInstance = new csrf();

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (req.session.secret == undefined) {
        throw new HttpException('Invalid request', HttpStatus.FORBIDDEN)
      }
      // @ts-ignore
      const verify = await this.csrfInstance.verify(req.session.secret, req.headers.token);

      if (!verify) {
        throw new HttpException("Invalid CSRF token", HttpStatus.FORBIDDEN)
      }

      next();
    } catch (error) {
      return next(error)
    }
  }
}
