import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageToAppService {

  recievedImage$ = new Subject<any>();
  recievedColorImage$ = new Subject<any>();

  constructor() { }
}
