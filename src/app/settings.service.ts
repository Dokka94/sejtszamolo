import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListMeretSetting } from './meretSettings';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  baseApiUrl = "http://kalgod5.homelinux.org:666/api/";

  constructor(private http: HttpClient, private messageService: MessageService) {}

  getSettings(id): Observable<any> {
    return this.http.get(this.baseApiUrl+"getFilters/"+id)
  }

  uploadColorSettings(data:string, imageId: string): Observable<any> {
    const formData = new FormData();
    formData.append("param",data);
    formData.append("kepId", imageId);
    return this.http.post(this.baseApiUrl+"set-user-kephez-rendelt-parametere-szin-skala",formData);
  }

  uploadRangeSettings(meretSettings: ListMeretSetting, imageId: string): Observable<any> {
    const formData = new FormData();
    meretSettings.meretSetting.forEach(
      e => {
        formData.append("listMeretSetting",JSON.stringify(e));
      }
    );
    formData.append("kepId", imageId);
    return this.http.post(this.baseApiUrl+"set-list-meret-setting",formData);
  }
}
