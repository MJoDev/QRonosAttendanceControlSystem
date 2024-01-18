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
    momentfechas: string[] = this.getDatesOfMonth();
    fechaYear: string = "";
    filtroNombre: string = '';
    datesOfMonthWithDay: { date: Date; dayOfWeek: string }[] = this.getDatesOfMonthWithDay();
  

    constructor(
    private router: Router, 
    private usuarioService: UserService,
    private route: ActivatedRoute
    ){}
    ngOnInit(): void {
      this.obtenerUsuarios();
      const fechaActual = new Date();
      this.fechaYear = moment(fechaActual).format('YYYY-MM-DD');

      console.log(this.momentfechas);
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
    getDatesOfMonth(): string[] {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
      const datesArray: Date[] = [];
      let currentDatePointer = firstDayOfMonth;
    
      const momentfechas = [];

      while (currentDatePointer <= lastDayOfMonth) {
        datesArray.push(new Date(currentDatePointer));
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
        
      }

      for(var i = 0; i < datesArray.length; i++){
        const nuevaFecha = moment(datesArray[i]).format('YYYY-MM-DD');
        var proposedDate = nuevaFecha + "T00:00:00.000Z";
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

    getDatesOfMonthWithDay(): { date: Date; dayOfWeek: string }[] {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
      const datesArray: { date: Date; dayOfWeek: string }[] = [];
      let currentDatePointer = firstDayOfMonth;
    
      while (currentDatePointer <= lastDayOfMonth) {
        datesArray.push({
          date: new Date(currentDatePointer),
          dayOfWeek: this.getDayOfWeek(currentDatePointer.getDay()),
        });
        currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      }
    
      return datesArray;
    }
    
    getDayOfWeek(dayIndex: number): string {
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return daysOfWeek[dayIndex];
    }
}
