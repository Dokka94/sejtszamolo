import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { range } from 'rxjs';
import { FileUploadService } from '../file-upload.service';
import { FilterColor } from '../filterColor';
import { ImageToAppService } from '../image-to-app.service';
import { RangeItem } from '../range-settings/rangeItem';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  defaultColorFilters: { rmin: number; rmax: number; bmin: number; bmax: number; gmin: number; gmax: number; };

  constructor(private fb: FormBuilder, private imageService: ImageToAppService, private settingsService: SettingsService, private fileService: FileUploadService) { }

  @Input() rmin: number;
  @Input() rmax: number;
  @Input() gmin: number;
  @Input() gmax: number;
  @Input() bmin: number;
  @Input() bmax: number;
  @Input() set rangeItems(rangeItems: RangeItem[]) {
    console.log(rangeItems);
    this._rangeItems = rangeItems;
  }


  colorFilters: FilterColor;
  _rangeItems: RangeItem[];
  redSkipped: boolean;
  retrievedImage = null;
  colorForm = this.fb.group({
    selectedRed: ['Skip'],
    selectedGreen: ['Skip'],
    selectedBlue: ['Skip'],
    redControl: [[0,255]],
    greenControl: [[0,255]],
    blueControl: [[0,255]],
  });
  optionsRed: Options = {
    disabled: true,
    floor: 0,
    ceil: 255,
    step: 1,
    showSelectionBar: true,
    selectionBarGradient: {
      from: 'black',
      to: '#F00'
    }
  };
  optionsGreen: Options = {
    disabled: true,
    floor: 0,
    ceil: 255,
    step: 1,
    showSelectionBar: true,
    selectionBarGradient: {
      from: 'black',
      to: '#0F0'
    }
  };
  optionsBlue: Options = {
    disabled: true,
    floor: 0,
    ceil: 255,
    step: 1,
    showSelectionBar: true,
    selectionBarGradient: {
      from: 'black',
      to: '#00F'
    }
  };


  ngOnInit(): void {
    this.defaultColorFilters = {
      rmin: 0,
      rmax: 255,
      bmin: 0,
      bmax: 255,
      gmin: 0,
      gmax: 255
    };
    this.colorFilters = this.defaultColorFilters;
    if (localStorage.length>0) {
      this.getSettings();
    }
  }

  getSettings() {
    let imageId = localStorage.getItem("imageId");
    this._rangeItems = [];
      this.settingsService.getSettings(imageId).subscribe(
        (response) => {
          console.log(response);
          this.colorFilters =  Object.assign({},this.defaultColorFilters, JSON.parse(response.filter_color.value));
          console.log(this.colorFilters);
          this.setInitColorSliders(this.colorFilters);
          this._rangeItems = JSON.parse(response.filter_kiertekelo.value);
          console.log(this._rangeItems);
        }
      );
  }

  setInitColorSliders(colorFilter: FilterColor) {
    this.redControl.setValue([colorFilter.rmin,colorFilter.rmax]);
    if(colorFilter.rmax != 255 && colorFilter.rmin != 0) {
      this.selectedRed.setValue('On');
      this.redChange();
    }
    this.greenControl.setValue([colorFilter.gmin,colorFilter.gmax]);
    if(colorFilter.gmax != 255 && colorFilter.gmin != 0) {
      this.selectedGreen.setValue('On');
      this.greenChange();
    }
    this.blueControl.setValue([colorFilter.bmin,colorFilter.bmax]);
    if(colorFilter.bmax != 255 && colorFilter.bmin != 0) {
      this.selectedBlue.setValue('On');
      this.blueChange();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    this.changeColor(changes.rmin,changes.rmax,this.redControl,this.selectedRed);
    this.redChange();
    this.changeColor(changes.gmin,changes.gmax,this.greenControl,this.selectedGreen);
    this.greenChange();
    this.changeColor(changes.bmin,changes.bmax,this.blueControl,this.selectedBlue);
    this.blueChange();
  }

  changeColor(min: SimpleChange, max: SimpleChange, colorControl: AbstractControl, colorSelector: AbstractControl) {
    let isMinChanged: boolean = min && (min.currentValue != undefined);
    let isMaxChanged: boolean = max && (max.currentValue != undefined);
    if (isMinChanged && isMaxChanged ) {   
        colorControl.setValue([min.currentValue,max.currentValue]);
    } else {
      if (isMinChanged) {
        colorControl.setValue([min.currentValue,colorControl.value[1]]);
      }
      if (isMaxChanged) {
        colorControl.setValue([colorControl.value[0],max.currentValue]);
      } 
    }
    if ((isMinChanged && !min.firstChange) || (isMaxChanged  && !max.firstChange)) {
      colorSelector.setValue('On');
    }
    if ((isMinChanged && min.currentValue == 0) || (isMaxChanged && max.currentValue == 255)) {
      colorSelector.setValue('Skip');
    }
  }
    
  get selectedRed() {
    return this.colorForm.get("selectedRed");
  }

  get selectedGreen() {
    return this.colorForm.get("selectedGreen");
  }

  get selectedBlue() {
    return this.colorForm.get("selectedBlue");
  }

  get redControl() {
    return this.colorForm.get('redControl');
  }

  get greenControl() {
    return this.colorForm.get('greenControl');
  }

  get blueControl() {
    return this.colorForm.get('blueControl');
  }

  redChange() {
    let skip: boolean = this.selectedRed.value === 'Skip';
    this.optionsRed = Object.assign({}, this.optionsRed, {disabled: skip});
  }

  greenChange() {
    let skip: boolean = this.selectedGreen.value === 'Skip';
    this.optionsGreen = Object.assign({}, this.optionsGreen, {disabled: skip});
  }

  blueChange() {
    let skip: boolean = this.selectedBlue.value === 'Skip';
    this.optionsBlue = Object.assign({}, this.optionsBlue, {disabled: skip});
  }

  submit(){
    let data = {};
    if (this.selectedRed.value !== 'Skip') {
      data["rmin"] = this.redControl.value[0];
      data["rmax"] = this.redControl.value[1];
    }
    if (this.selectedGreen.value !== 'Skip') {
      data["gmin"] = this.greenControl.value[0];
      data["gmax"] = this.greenControl.value[1];
    }
    if (this.selectedBlue.value !== 'Skip') {
      data["bmin"] = this.blueControl.value[0];
      data["bmax"] = this.blueControl.value[1];
    }
    let dataJson = JSON.stringify(data);
    let imageId = localStorage.getItem('imageId');
    this.settingsService.uploadColorSettings(dataJson,imageId).subscribe(
      response =>
      console.log(response),
      err => {
        console.error(err);
      }
    );

    this.fileService.getColorImage(imageId).subscribe(
      (response) => {
        let base64Data = response.imgage;
        let retrievedColorImage = 'data:image/jpeg;base64,' + base64Data;
        this.emitStuff(retrievedColorImage,imageId);
    });
  }

  emitStuff(retrievedImage,imageId): void {
    this.imageService.recievedColorImage$.next([retrievedImage,imageId]);
  }

}
