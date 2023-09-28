import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isAvailable(): string {
    return 'App is running!';
  }
}
