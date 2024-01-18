import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  usuarios: any[] = [];
  filtroNombre: string = '';

  constructor(private router: Router, 
    private usuarioService: UserService,
     private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.obtenerUsuarios();
    console.log(this.usuarios);
    
    
  }
  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(
      obtenerUsuarios => {
        this.usuarios = obtenerUsuarios;
        
        //elimino a los usuarios que no tengan nombre(Admins)
        for(var i = 0; i < this.usuarios.length; i++){
          if(this.usuarios[i].mostrar == false){
            this.usuarios.splice(i, 1);
          }
          if(this.usuarios[i].admin == true){
            this.usuarios.splice(i, 1);
          }
          }
        
      },
      error => {
        console.log('Error al obtener usuarios:', error);
      }
    );
  }
  eliminarUsuario(id: any){
    this.usuarioService.obtenerUsuarioPorId(id).subscribe(data => {
      this.obtenerUsuarios();
    }, error => {console.log(error)});
  }

  getAttendanceCount(user: any): number[] {
    const count: number[] = Array(1).fill(0);

    user.forEach((entry:any) => {
      count[0]++;
    });

    return count;
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
