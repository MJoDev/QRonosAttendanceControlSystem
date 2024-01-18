import { Component, OnInit } from '@angular/core';
import { UserContact } from '../models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public myForm!:FormGroup;

  constructor(private fb:FormBuilder, private authservice: AuthService){
    
  }
  OnSubmit(){
   
  }
  //Al iniciar la pagina, crea el formulario
  ngOnInit(){
    this.myForm = this.createMyForm();
  }

  //creacion del formulario
  private createMyForm():FormGroup{
    return this.fb.group({
      name: ['', Validators.required],
      user:['', Validators.required],
      password:['', Validators.required],
      cedula:['', Validators.required],
      admin: false,
      mostrar: true,
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
      
      if(this.myForm.value.admin == true){
        this.myForm.value.name = undefined;
        this.myForm.value.mostrar = false;
      }
      console.log(this.myForm.value);

      this.authservice.signIn(this.myForm.value)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);
            alert('El usuario ya existe');
          },
          err => {
            this.authservice.signUp(this.myForm.value)
              .subscribe(
                res => {console.log(res);
                  localStorage.setItem('token', res.token); alert('El usuario ha sido creado');},
                err => {console.log(err)}
              )
          }
         )    
    }
    
  }

  public get f():any{
    return this.myForm.controls;
  }
}
