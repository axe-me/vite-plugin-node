import { Injectable } from '@nestjs/common';
import { str } from './str';

@Injectable()
export class AppService {
  getHello(): string {
    return `change To see updates! ${str} from a new file,..`;
  }
}
