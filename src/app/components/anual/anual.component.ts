import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css']
})
export class AnualComponent implements OnInit{
  usuarios: any[] = [];
  momentfechas: string[] = this.guardarFechas();
  filtroNombre: string = '';
  fechasAnuales: string[] = [];
  fechasAnales: Date[] = [];
  usersWithAttendance: any[] = [];
  fechaYear: string = "";

  constructor(private router: Router, 
    private usuarioService: UserService,
     private route: ActivatedRoute
    ){}

  ngOnInit(){
    this.obtenerUsuarios();
     // Obtén la fecha actual para determinar el año actual
      const fechaActual = new Date();
      const añoActual = fechaActual.getFullYear();
      this.fechaYear = moment(fechaActual).format('YYYY-MM-DD');

      // Crea un arreglo de fechas desde el 1 de enero hasta el 31 de diciembre del año actual
      this.fechasAnales = Array.from({ length: 12 }, (_, i) => new Date(añoActual, i, 1));
      const fechas = this.fechasAnales.map(fecha=>{
        const momento = moment(fecha).format('YYYY-MM-DD');
        this.fechasAnuales.push(momento);
      })
  }

  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(
      obtenerUsuarios => {
        this.usuarios = obtenerUsuarios;
        //elimino a los usuarios que no tengan nombre(Admins)
        for(var i = 0; i < this.usuarios.length; i++){
          if(this.usuarios[i].name == undefined){
            this.usuarios.splice(i, 1);
          }
         }
      },
      error => {
        console.log('Error al obtener usuarios:', error);
      }
    );
   }

  guardarFechas(): string[] {
    const anioActual = new Date().getFullYear();
    const inicioDelAnio = new Date(anioActual, 0, 1);
    const finDelAnio = new Date(anioActual, 11, 31);

    const momentfechas = [];
    let fechaActual = inicioDelAnio;
    while (fechaActual <= finDelAnio) {
      const fechabucle = new Date(fechaActual);
      var localTime = moment(fechabucle).format('YYYY-MM-DD');
      var proposedDate = localTime + "T00:00:00.000Z";
      momentfechas.push(proposedDate);


      fechaActual.setDate(fechaActual.getDate() + 1);
    }
 
    return momentfechas;
  }
  getAttendanceCountByMonth(user: any): number[] {
    const countByMonth: number[] = Array(12).fill(0);

    user.forEach((entry:any) => {
      const mes = moment(entry).format('YYYY-MM-DD');
      console.log(mes);
      const monthIndex = moment(entry).month();
      countByMonth[monthIndex]++;
    });

    return countByMonth;
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



