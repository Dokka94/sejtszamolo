import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MeretSetting, ListMeretSetting } from '../meretSettings';
import { ResultsService } from '../results.service';
import { SettingsService } from '../settings.service';
import { RangeItem } from './rangeItem';

@Component({
  selector: 'app-range-settings',
  templateUrl: './range-settings.component.html',
  styleUrls: ['./range-settings.component.scss']
})
export class RangeSettingsComponent implements OnInit {
  @Input() set rangeItems(rangeItems: RangeItem[]) {
    console.log(rangeItems);
    this._rangeItems = rangeItems;
  }
  colorString: string;
  private _rangeItems: RangeItem[];
  
  form = this.fb.group({
    settings: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private settingsService: SettingsService, private resultService: ResultsService) { }

  ngOnInit(): void {
    if (localStorage.length>0) {
      let imageId = localStorage.getItem("imageId");
      console.log(this._rangeItems);
    }
  
  }

  getRangeItems(imageId): void {
      this.settingsService.getSettings(imageId).subscribe (
        response => {
          if (response.filter_kiertekelo) {
            console.log(response.filter_kiertekelo.value);
            this._rangeItems = JSON.parse(response.filter_kiertekelo.value);
          } 
        }
      );
  }

  get settings(): FormArray {
    return this.form.controls["settings"] as FormArray;
  }

  onSubmit(): void {
    console.log("Saved");
    console.log(this.settings);
    this.submit();
  }

  onChangeColor(color: string, index: number): void {
    const colorCtr = this.settings.controls[index].get('colorCtr');
    colorCtr.setValue(color);
  }

  loadSettings() {
    //let imageId = localStorage.getItem("imageId");
    //this.getRangeItems(imageId);
    //Needs to be wait the range item to be back, otherwise it needs to be double click to load the current pictures settings

    this.setSettingsControllers(this._rangeItems.length);
    
  }

  setSettingsControllers(savedSettingsLength: number) {
    this.settings.clear();
    for(let i=0; i< savedSettingsLength; i++) {
      const rangeItemForm = this.fb.group({
        minCtr: ['', Validators.required],
        colorCtr: ['', Validators.required]
      });
      this.settings.push(rangeItemForm);
      const settingsLength = this.settings.length;
      console.log(+settingsLength-1+". Range item: min "+ this._rangeItems[settingsLength-1].meretMin)
      this.settings.controls[settingsLength-1].get('minCtr').setValue(this._rangeItems[settingsLength-1].meretMin);
      this.settings.controls[settingsLength-1].get('colorCtr').setValue(this.parseRgbToColor(settingsLength-1));
      console.log(this.settings.controls[settingsLength-1].get('colorCtr').value);
    }
}

  addRangeItem(index?: number): void {
    const rangeItemForm = this.fb.group({
      minCtr: ['', Validators.required],
      colorCtr: ['', Validators.required]
    });

    index!=undefined? this.settings.insert(index+1,rangeItemForm) : this.settings.push(rangeItemForm);
  }

  deleteRangeItem(rangeItemIndex: number): void {
    this.settings.removeAt(rangeItemIndex);
  }

  parseRgbToColor(index) {
    let red = this._rangeItems[index].red;
    let green = this._rangeItems[index].green;
    let blue = this._rangeItems[index].blue;
     return "rgb("+red+","+green+","+blue+")";
  }

  submit() {
    let meretMin: number;
    let meretSettings: MeretSetting[] = [];
    for(let i=0; i< this.settings.length; i++) {
      const colorCtrValue: string = this.settings.controls[i].get('colorCtr').value; //(rgb:123,234,123)
      const colorNumbers: string[] = colorCtrValue.match(/(\d{1,3})/g); //[123,45,67]
      let meretSetting: MeretSetting;
      meretMin = parseInt(this.settings.controls[i].get('minCtr').value);
      meretSetting = {
        red: parseInt(colorNumbers[0]),
        green: parseInt(colorNumbers[1]),
        blue: parseInt(colorNumbers[2]),
        meretMin: meretMin
      };
      meretSettings.push(meretSetting);
    }
    console.log(meretSettings);
    let data: ListMeretSetting = {
      meretSetting: meretSettings
    };
    let imageId = localStorage.getItem("imageId");
    this.settingsService.uploadRangeSettings(data,imageId).subscribe();
  }

  


  

}
