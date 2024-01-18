import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-mensual',
  templateUrl: './mensual.component.html',
  styleUrls: ['./mensual.component.css']
})
export class MensualComponent implements OnInit{

    usuarios: any[] = [];
    fechasSemana: Date[] = this.obtenerFechas(); // Ahora inicializamos fechasSemana aquí
    momentfechas: string[] = this.cambiarFechas();
    fechaYear: string = "";
    filtroNombre: string = '';
    NombreDiasSemana: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

    constructor(
    private router: Router, 
    private usuarioService: UserService,
    private route: ActivatedRoute
    ){}
    ngOnInit(): void {
      this.obtenerUsuarios();
      console.log(this.momentfechas);
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
    obtenerFechas(): Date[] {
      const fechaActual = new Date();
      const diaSemana = fechaActual.getDay();
      const primerDiaSemana = new Date(fechaActual);
      primerDiaSemana.setDate(fechaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
      
  
      const fechasSemana = [];
      const fechasFormateadas = [];
      for (let i = 0; i < 7; i++) {
        const nuevaFecha = new Date(primerDiaSemana);
        nuevaFecha.setDate(primerDiaSemana.getDate() + i);
  
        fechasSemana.push(nuevaFecha);
    }
  
      return fechasSemana;
    }
    cambiarFechas(): string[] {
      //primero obtiene la fecha actual, el dia de hoy
      const fechaActual = new Date();
      //luego, obtiene el valor del dia de la semana  para domingo, 6 para sabado
      const diaSemana = fechaActual.getDay();
      //el primer dia de la semana es igual a la fecha actual
      const primerDiaSemana = new Date(fechaActual);
      //el primer dia de la semana es igual a el valor - el valor
      primerDiaSemana.setDate(fechaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
      
  
      const momentfechas = [];
      const fechasFormateadas = [];
      for (let i = 0; i < 7; i++) {
        const nuevaFecha = new Date(primerDiaSemana);
        nuevaFecha.setDate(primerDiaSemana.getDate() + i);
        var localTime = moment(nuevaFecha).format('YYYY-MM-DD');
        var proposedDate = localTime + "T00:00:00.000Z";
  
        momentfechas.push(proposedDate);
      }
  
      return momentfechas;
    }
    imprimirLista(){
      // Extraemos el
      const DATA = document.getElementById('listaAnual')!;
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
