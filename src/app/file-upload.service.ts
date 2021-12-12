import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseApiUrl = "http://kalgod5.homelinux.org:666/api/";

  constructor(private http: HttpClient) {}

  upload(file): Observable<any> {
    const formData = new FormData();
    formData.append("file",file,file.name);
    return this.http.post(this.baseApiUrl+"uploadFile", formData);
  }

  getImage(id): Observable<any> {
    return this.http.get(this.baseApiUrl+"getImage/" + id);
  }

  getColorImage(id): Observable<any> {
    return this.http.get(this.baseApiUrl+"kep-szin-szurt/" + id)
  }

  getImageList(): Observable<any> {
    return this.http.get(this.baseApiUrl+"getImageList");
  }
}
