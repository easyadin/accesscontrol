import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workform'
})
export class WorkformPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
