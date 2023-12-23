import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Injectable } from '@angular/core'
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardAdmin implements CanActivate{

  constructor(private authService: AuthService, private router: Router){

  }

  canActivate(): boolean{
    if (this.authService.isAdmin()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}