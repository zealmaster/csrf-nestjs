import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as csrf from 'csrf-tokens';
import * as dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config()

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route to generate the csrf token
  @Get('csrf')
  async getCsrfToken(@Req() req: Request): Promise<{ token: string; }> {
    try {
      const csrfInstance = new csrf();
      const secret = await csrfInstance.secret()
      // @ts-ignore
      req.session.secret = secret
      const token = await csrfInstance.create(secret)
      return { token }
    } catch (error) {
      console.log(error)
    }
  }

  // Route that requires csrf token to access
  @Post('send')
  async sendBody(@Body() body: any) {
    try {
      return { body }
    } catch (error) {
      console.log(error)
    }
  }

}
