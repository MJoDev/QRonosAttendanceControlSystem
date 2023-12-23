import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incrementar'
})
export class IncrementarPipe implements PipeTransform {

  transform(array: any[], fecha: string): number {
    if (array && array.includes(fecha)) {
      return array.length + 1;
    } else {
      return array.length;
    }
  }
}