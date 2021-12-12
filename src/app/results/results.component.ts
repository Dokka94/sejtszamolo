import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ResultsService } from '../results.service';
import { ResultItem } from './result-item';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  resultItems: ResultItem[];
  colors: string[] = [];
  resultImage: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  message: string;
  loaded: boolean;
  error: boolean;


  constructor(private resultsService: ResultsService) { }

  ngOnInit(): void {
    if (localStorage.length>0) {
      this.getResultImageAndResultTable();
      this.dtOptions = {
        pagingType: 'full_numbers',
        dom: 'Bfrtip',
        paging: false
      };
    } else {
      this.error = false;
      this.message = "No image to Analyze";
    }
  }

  exportResults(): void {
    console.log("Exported")
    console.log(this.resultItems);
  }

  convertRgbToColor() {
    for (let i=0;i<this.resultItems.length;i++) {
      const red = this.resultItems[i].red;
      const green = this.resultItems[i].green;
      const blue = this.resultItems[i].blue;
      const color = "#" + this.componentToHex(red) + this.componentToHex(green) + this.componentToHex(blue);
      this.colors.push(color);
    }

  }

  componentToHex(component: number) {
    let hex = component.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  getResultTable(imageId: string) {
    this.resultsService.getResult(imageId).subscribe(
      response => {
        console.log(response);
        this.resultItems = response;
        this.convertRgbToColor();
        this.dtTrigger.next();
        this.loaded = true;
      },
      (err) => {
        this.message = "Error while fetching data.";
        this.loaded = false;
        this.error = true;
        console.error(err);
      }
    );
  }

  getResultImageAndResultTable() {
    const imageId = localStorage.getItem("imageId");
    this.resultsService.getResultImage(imageId).subscribe(
      (response) => {
        const base64Data = response.imgage;
        this.resultImage = 'data:image/jpeg;base64,' + base64Data;
      }
    );
    this.getResultTable(imageId);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
