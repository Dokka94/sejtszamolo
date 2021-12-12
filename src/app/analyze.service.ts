import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  baseApiUrl = "http://kalgod5.homelinux.org:666/api/";

  constructor(private http: HttpClient) {}

  startAnalyze(imageId: string): Observable<any> {
    const formData = new FormData();
    formData.append("kepId", imageId);
    return this.http.post(this.baseApiUrl+"start-analize",formData);
  }
  
  startAnalyzeWithParam(imageId, range): Observable<any> {
    const formData = new FormData();
    formData.append("kepId", imageId);
    formData.append("range",range);
    return this.http.post(this.baseApiUrl+"start-analize-with-param",formData);
  }

  //Do not call: no endpoint in BE
  cancelAnalyze(imageId): Observable<any> {
    const formData = new FormData();
    formData.append("kepId", imageId);
    return this.http.post(this.baseApiUrl+"cancel-analize",formData);
  }

  getStatus(imageId): Observable<any> {
    return this.http.get(this.baseApiUrl+"get-analize-status/"+imageId);
  }
}
