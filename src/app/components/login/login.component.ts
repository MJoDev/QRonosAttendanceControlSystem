import { Component, OnInit } from '@angular/core';
import { UserContact } from '../models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  public myForm!:FormGroup;
  public QrInfor!: string;

  constructor(private fb:FormBuilder, private authservice: AuthService, private router: Router){
    
  }
  OnSubmit(){
   
  }
  //Al iniciar la pagina, crea el formulario
  ngOnInit(){
    localStorage.removeItem('token');
    localStorage.removeItem('QRCODE');
    localStorage.removeItem('ScanUser');
    localStorage.removeItem('admin');
    this.myForm = this.createMyForm();
  }

  //creacion del formulario
  private createMyForm():FormGroup{
    return this.fb.group({
      user:['', Validators.required],
      password:['', Validators.required]
    });
  }
  public submitForm(){
    //Si no estan llenos los dos, el formulario es invalido
    if(this.myForm.invalid){
      Object.values(this.myForm.controls).forEach(control =>{
        control.markAllAsTouched();
      });
      return;
    }
    //enviar la informacion
    else{
      this.QrInfor = JSON.stringify(this.myForm.value);
      console.log(this.QrInfor);
      this.authservice.signIn(this.myForm.value)
        .subscribe(
          res => {console.log(res);
            localStorage.setItem('token', res.token);
            if (res.isAdmin){
              localStorage.setItem('admin', 'true');
              this.router.navigate(['/home']);
            }
            else{
              localStorage.setItem('QRCODE', this.QrInfor);
              this.router.navigate(['/user']);
            }
            },
          err => {console.log(err); alert('Usuario o contraseña incorrecta')}
          )
    }
    
  }

  public get f():any{
    return this.myForm.controls;
  }
}
