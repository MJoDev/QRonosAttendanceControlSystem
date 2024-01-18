import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routing, appRoutingProviders } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ScannerComponent } from './components/scanner/scanner.component';
import { FiltroPipe } from './components/home/filtro.pipe';
import { AnualComponent } from './components/anual/anual.component';
import { IncrementarPipe } from './components/anual/incrementar.pipe';
import { MensualComponent } from './components/mensual/mensual.component';
import { UsersComponent } from './components/users/users.component';
import { PeriodosComponent } from './components/periodos/periodos.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    LoginComponent,
    ErrorComponent,
    RegisterComponent,
    ScannerComponent,
    FiltroPipe,
    AnualComponent,
    IncrementarPipe,
    MensualComponent,
    UsersComponent,
    PeriodosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    NgxScannerQrcodeModule,
  ],
  providers: [
    appRoutingProviders,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
