import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  baseApiUrl = "http://kalgod5.homelinux.org:666/api/";

  constructor(private http: HttpClient) {}

  getResult(id): Observable<any> {
    return this.http.get(this.baseApiUrl+"meret-szurt-tabla/"+id);
  }

  getResultImage(id): Observable<any> {
    return this.http.get(this.baseApiUrl+"kep-es-adat-meret-szurt-is/"+id);
  }
  
}
