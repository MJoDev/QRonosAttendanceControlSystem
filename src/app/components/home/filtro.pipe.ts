import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
  transform(usuarios: any[], filtroNombre: string): any[] {
    if (!filtroNombre) {
      return usuarios;
    }
    return usuarios.filter(usuario => usuario.name.toLowerCase().includes(filtroNombre.toLowerCase()));
    }
}
