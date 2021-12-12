import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { DetailedImage } from '../DetailedImage';
import { FileUploadService } from '../file-upload.service';
import { FilterColor } from '../filterColor';
import { ImageToAppService } from '../image-to-app.service';
import { RangeItem } from '../range-settings/rangeItem';
import { ImageNameItem } from './imageNameItem';
import { ImageResponse } from './imageResponse';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  imageForm = this.fb.group({
    selectedImage: ['']
  })
  loadingFile: boolean = false;
  message: string;
  selectedFile: File = null;
  toggledSettings: boolean = false;
  imageList: ImageNameItem[];
  defaultColorFilter: FilterColor;
  colorFilter: FilterColor;
  rangeItems: RangeItem[];



  constructor(private fileUploadService: FileUploadService, private imageService: ImageToAppService, private fb: FormBuilder) { }

  ngOnInit(): void { 
    this.fileUploadService.getImageList().subscribe(
      response => {
        this.imageList = response;
      },
      (err) => {
        this.message = "Check console for errors. Get in touch with the Administrator";
        console.log(err);
      }
    );
    //default color filter for settings when image has no filter yet
    this.defaultColorFilter = {
      rmin: 0,
      rmax: 255,
      bmin: 0,
      bmax: 255,
      gmin: 0,
      gmax: 255
    };
    this.colorFilter = this.defaultColorFilter;
  }

  get selectedImage(): AbstractControl {
    return this.imageForm.get("selectedImage");
  }

  onChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  changeImage($event: any) {
    let imageId: string = $event.target.value;
    imageId = imageId.split(":")[1].trim();
    this.selectedImage.setValue(imageId, {
      onlySelf: true
    });
  }

  openImage() {
    console.log(this.selectedImage.value);
    this.colorFilter = this.defaultColorFilter;
    this.getImage(this.selectedImage.value);
    this.toggledSettings = true;
  }

  emitStuff(retrievedImage,imageId): void {
    this.imageService.recievedImage$.next([retrievedImage,imageId]);
  }

  onUpload() {
    this.loadingFile = !this.loadingFile;
    this.message = "Check console for errors. Error occurred in upload.";
    /*this.fileUploadService.upload(this.selectedFile).subscribe(
      (response: ImageResponse) => {
        this.loadingFile = false;
        const imageId = response.imageId;
        this.getImage(imageId);
        this.toggledSettings = true;
        this.message=undefined;
      },
      (err) => {
        this.message = "Check console for errors. Error occurred in upload.";
        console.log(err);
      }
    );*/
  }

  getImage(imageId: number) {
    this.fileUploadService.getImage(imageId).subscribe(
      (response) => {
        let base64Data = response.imgage;
        let retrievedImage = 'data:image/jpeg;base64,' + base64Data;
        console.log(response);
        if (response.filter_color) {
          let obj = JSON.parse(response.filter_color.value);
          this.colorFilter = Object.assign({},this.defaultColorFilter, obj);
          console.log(this.colorFilter);
        }
        if (response.filter_kiertekelo) {
          this.rangeItems = JSON.parse(response.filter_kiertekelo.value);
        }
        this.emitStuff(retrievedImage,imageId);
        this.message=undefined;
      },
      (err) => {
        this.message = "Check console for errors. Get in touch with the Administrator";
        console.log(err);
      }
    );
  }

  

  clearImages() {
    localStorage.clear();
    window.location.reload();
  }

}
