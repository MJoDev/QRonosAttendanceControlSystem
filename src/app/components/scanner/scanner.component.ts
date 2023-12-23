import { Component } from '@angular/core';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent{

    public ScannedUser!: string;
    public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
    public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
    isBeep: false,
    };

    constructor(private qrcode: NgxScannerQrcodeService, private authService: AuthService) {}

    public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    var resultado = e;
    this.ScannedUser = resultado[0].value;

    //Si el Usuario escaneado tiene algun valor, ejecuta:
    if(this.ScannedUser != ""){
      //Guarda el valor del QR en el local Storage
      localStorage.setItem('ScanUser', this.ScannedUser);
      alert("Usuario escaneado!");
      action.stop();

      var ObjetoUsuario = JSON.parse(this.ScannedUser);
      this.authService.QRSignIn(ObjetoUsuario)
        .subscribe(res =>{
          console.log(res);
        }, err=>{console.log(err)});
    
    }
    console.log(this.ScannedUser);
    }

}
