import { Component, OnInit } from '@angular/core';
import { ImageToAppService } from '../image-to-app.service';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss']
})
export class DisplayImagesComponent implements OnInit {
  retrievedImage: string;
  retrievedColorImage: string;

  constructor(private imageService: ImageToAppService) { }

  ngOnInit(): void {
    this.imageService.recievedImage$.subscribe($event => {
      this.retrievedImage = $event[0];
      localStorage.setItem("imageData",this.retrievedImage);
      localStorage.setItem("imageId", $event[1])
    });
    if(localStorage.length>0) {
      this.retrievedImage = localStorage.getItem("imageData");
    }
    this.imageService.recievedColorImage$.subscribe($event => {
      this.retrievedColorImage = $event[0];
      localStorage.setItem("colorImageData",this.retrievedColorImage);
      localStorage.setItem("colorImageId", $event[1])
    });
    if(localStorage.length>2) {
      this.retrievedColorImage = localStorage.getItem("colorImageData");
    }
  }

}
