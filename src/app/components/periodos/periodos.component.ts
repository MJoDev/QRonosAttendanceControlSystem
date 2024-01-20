import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css']
})

export class PeriodosComponent implements OnInit {

    
    rangoInicio: string = '';
    rangoFin: string = '';
    fechasEnRango: Date[] = [];
     usuarios: any[] = [];
     fechaYear: string = "";
     filtroNombre: string = '';
     momentfechas: string[] = [];
    omitirFinDeSemana: boolean = false;

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
      const momentfechas = [];
    
      const fechaInicio = new Date(this.rangoInicio);
      const fechaFin = new Date(this.rangoFin);
    
      // Verificar si rangoInicio es un string válido
      if (isNaN(fechaInicio.getTime())) {
        console.error("Error: rangoInicio no es una fecha válida.");
        return;
      }
    
      // Hacemos una copia para no afectar la fecha original
      const fechaActual = new Date(fechaInicio);
    
      while (fechaActual <= fechaFin) {
        if (!this.omitirFinDeSemana || (fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6)) {
          fechasEnRango.push(new Date(fechaActual.getTime()));
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    
      for (let i = 0; i < fechasEnRango.length; i++) {
        const nuevaFecha = moment(fechasEnRango[i]).format('YYYY-MM-DD');
        const proposedDate = nuevaFecha + "T00:00:00.000Z";
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
    
    //REPORTES
    generarPDF() {
      const pdf = new jsPDF() as jsPDFCustom;

      // Crear array de datos para la tabla
      const data = this.usuarios.map(usuario => [
        usuario.name,
        this.obtenerTotalAsistencias(usuario.asistencia),
        this.obtenerTotalInasistencias(usuario.asistencia)
      ]);
      pdf.text(`Reporte de ${this.rangoInicio}` + ` Hasta ${this.rangoFin}`, 10, 40);
      if(this.omitirFinDeSemana){
        pdf.text(`Se estan omitiendo los fines de semana`, 10, 50);
      }
      // Agregar encabezados de la tabla
      const headers = ['Usuario', 'Total Asistencias', 'Total Inasistencias'];
  
      // Crear la tabla en el PDF
      pdf.autoTable({
        head: [headers],
        body: data,
        startY: 10,
      });
      // Guardar el PDF
      pdf.save('reporte_asistencias_usuarios_desde_' + this.rangoInicio + '_hasta_' + this.rangoFin +'.pdf' );
    }

    obtenerTotalInasistencias(asistencia: string[]): number {
      return this.momentfechas
        .filter(fecha => !asistencia.some(asist => this.compararFechas(asist, fecha)))
        .length;
    }
  
    obtenerTotalAsistencias(asistencia: string[]): number {
      return asistencia.length;
    }
  
    compararFechas(fecha1: string, fecha2: string): boolean {
      // Función de comparación de fechas, ajusta según tus necesidades
      return fecha1 === fecha2;
    }
    
}

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}
