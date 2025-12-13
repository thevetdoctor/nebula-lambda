import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    const msg = process.env.API_MESSAGE ?? 'Welcome to the NEBULA App!';
    return { message: msg };
  }
}
