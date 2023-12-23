import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private URL = 'http://localhost:3000/api';

  constructor( private http: HttpClient) { }

  getTasks(){
    return this.http.get<any>(this.URL + '/tasks');
  }
  getPrivate(){
    return this.http.get<any>(this.URL + '/private-tasks');
  }
}
