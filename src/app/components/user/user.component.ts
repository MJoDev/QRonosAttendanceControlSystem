import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tasks: any = [];
  myAngularxQrCode:any;
  

  constructor(private homeService: HomeService, private qrcode: QRCodeModule, private authService: AuthService){
    this.myAngularxQrCode = authService.QRCodeGen();
  }
  ngOnInit(){
    this.homeService.getTasks()
      .subscribe(
        res => {
        console.log(res);
        this.tasks = res;
      },
      err => console.log(err));

     
  }
 
  
}
