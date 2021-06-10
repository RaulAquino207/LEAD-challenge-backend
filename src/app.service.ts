import { Injectable } from '@nestjs/common';
import { ResultDto } from './dto/result.dto';

@Injectable()
export class AppService {
  // getHello(): string {
  //   return 'Hello World!';
  // }

  getDescription() : ResultDto {
    return<ResultDto>{
      status: true,
      message: `API for LEAD Challenge.`
    }
  }
}
