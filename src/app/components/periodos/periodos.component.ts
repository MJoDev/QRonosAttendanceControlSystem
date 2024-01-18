import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})
export class PeriodosComponent implements OnInit {

    NombreDelDia: { fecha: Date; diaSemana: string }[] = [];
    rangoInicio: string = '';
    rangoFin: string = '';
    fechasEnRango: Date[] = [];
     usuarios: any[] = [];
     fechaYear: string = "";
     filtroNombre: string = '';
     momentfechas: string[] = [];

    constructor(private router: Router, 
    private usuarioService: UserService,
     private route: ActivatedRoute
    ){}

    ngOnInit(){
      this.obtenerUsuarios();
      const fechaActual = new Date();
      this.fechaYear = moment(fechaActual).format('YYYY-MM-DD');
    }
    obtenerUsuarios(){
      this.usuarioService.obtenerUsuarios().subscribe(
        obtenerUsuarios => {
          this.usuarios = obtenerUsuarios;
          
          //elimino a los usuarios que no tengan nombre(Admins)
          for(var i = 0; i < this.usuarios.length; i++){
            if(this.usuarios[i].admin == true){
              this.usuarios.splice(i, 1);
            }
            if(this.usuarios[i].mostrar == false){
              this.usuarios.splice(i, 1);
            }
           
            }
        },
        error => {
          console.log('Error al obtener usuarios:', error);
        }
      );
    }

    generarFechas() {
      const fechasEnRango = [];

      const fechaInicio = new Date(this.rangoInicio);
      const fechaFin = new Date(this.rangoFin);
  
      // Hacemos una copia para no afectar la fecha original
      const fechaActual = new Date(fechaInicio);
  
      while (fechaActual <= fechaFin) {
        fechaActual.setDate(fechaActual.getDate() + 1);
        fechasEnRango.push(new Date(fechaActual));
        this.NombreDelDia.push({
          fecha: new Date(fechaActual),
          diaSemana: this.obtenerDiaSemana(fechaActual),
      });
      }

      const momentfechas = [];
  
      for(var i = 0; i < fechasEnRango.length; i++){
        const nuevaFecha = moment(fechasEnRango[i]).format('YYYY-MM-DD');
        var proposedDate = nuevaFecha + "T00:00:00.000Z";
        momentfechas.push(proposedDate);
      }
      this.fechasEnRango = fechasEnRango;
      this.momentfechas = momentfechas;
    }

    obtenerDiaSemana(fecha: Date): string {
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return diasSemana[fecha.getDay()];
    }

    imprimirLista(){
      // Extraemos el
      const DATA = document.getElementById('listaSemanal')!;
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA, options).then((canvas) => {
  
        const img = canvas.toDataURL('image/PNG');
  
        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`${new Date().toISOString()}.pdf`);
      });
    }
}
