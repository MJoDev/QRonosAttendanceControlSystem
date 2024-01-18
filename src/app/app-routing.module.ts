import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Configuramos las rutas del proyecto

import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { RegisterComponent } from './components/register/register.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { AnualComponent } from './components/anual/anual.component';
import { MensualComponent } from './components/mensual/mensual.component';
import { UsersComponent } from './components/users/users.component';
import { PeriodosComponent } from './components/periodos/periodos.component';




import { AuthGuard } from './auth.guard';
import { AuthGuardAdmin } from './auth.guard.admin';

const appRoutes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'semanal', component: HomeComponent, canActivate: [AuthGuardAdmin]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuardAdmin]},
  {path: 'scanner', component: ScannerComponent, canActivate: [AuthGuardAdmin]},
  {path: 'anual', component: AnualComponent, canActivate: [AuthGuardAdmin]},
  {path: 'mensual', component: MensualComponent, canActivate: [AuthGuardAdmin]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuardAdmin]},
  {path: 'periodos', component: PeriodosComponent, canActivate: [AuthGuardAdmin]},
  {path: '**', component: ErrorComponent},
];

//Exportar las rutas

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})export class AppRoutingModule { }
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(appRoutes);


