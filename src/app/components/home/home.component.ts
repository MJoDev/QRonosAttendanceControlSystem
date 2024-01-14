import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  usuarios: any[] = [];
  nombres: string[] = [];
  fechasSemana: Date[] = this.obtenerFechas(); // Ahora inicializamos fechasSemana aquí
  momentfechas: string[] = this.cambiarFechas();
  fechasUsuarios: string[] = [];
  filtroNombre: string = '';
  fechaYear: string = "";
  NombreDiasSemana: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

  constructor(private router: Router, 
    private usuarioService: UserService,
     private route: ActivatedRoute
    ){}

  ngOnInit(){
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

  obtenerFechas(): Date[] {
    const fechaActual = new Date();
    const diaSemana = fechaActual.getDay();
    const primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
    

    const fechasSemana = [];
    const fechasFormateadas = [];
    for (let i = 0; i < 6; i++) {
      const nuevaFecha = new Date(primerDiaSemana);
      nuevaFecha.setDate(primerDiaSemana.getDate() + i);

      fechasSemana.push(nuevaFecha);
  }

    return fechasSemana;
  }
  cambiarFechas(): string[] {
    const fechaActual = new Date();
    const diaSemana = fechaActual.getDay();
    const primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));
    

    const momentfechas = [];
    const fechasFormateadas = [];
    for (let i = 0; i < 6; i++) {
      const nuevaFecha = new Date(primerDiaSemana);
      nuevaFecha.setDate(primerDiaSemana.getDate() + i);
      var localTime = moment(nuevaFecha).format('YYYY-MM-DD');
      var proposedDate = localTime + "T00:00:00.000Z";

      momentfechas.push(proposedDate);
    }

    return momentfechas;
  }
   eliminarUsuario(id: any){
    this.usuarioService.eliminarUsuario(id).subscribe(data => {
      this.obtenerUsuarios();
    }, error => {console.log(error)});
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
