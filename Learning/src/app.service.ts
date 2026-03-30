import { Injectable } from '@nestjs/common';
import { catsType } from './lib/Type';

@Injectable()
export class AppService {
  cats: catsType[] = [];

  getCats(): catsType[] {
    return this.cats;
  }

  addCat(body: catsType): any {
    this.cats.push(body);
    return body;
  }

  findCat(name: string): catsType[] {
    const findCat = this.cats.filter(
      (cat) => cat.name.toLowerCase() === name.toLowerCase(),
    );

    return findCat;
  }
}
