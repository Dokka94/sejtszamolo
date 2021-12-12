import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import {  takeWhile } from 'rxjs/operators';
import { AnalyzeService } from '../analyze.service';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent implements OnInit, OnDestroy {

  isRunning: boolean = false;
  hasResult: boolean = false;
  loadingValue: number;
  toggledResults: boolean = false;
  imageId: string;
  destroy$: Subject<void> = new Subject();
  message: string;
  range:number;
  
  constructor(private analyzeService: AnalyzeService) { }

  ngOnInit(): void {
    localStorage.length>0 ? this.imageId = localStorage.getItem("imageId") : this.imageId = undefined;
    if (this.imageId) {
      this.whileRunning();
    } 
  }
 

  onStart() {
    if (this.imageId) {
      if (this.range) {
      (async () => { 
        this.loadingValue = 0;
        console.log("imageId: "+ this.imageId);
        this.analyzeService.startAnalyzeWithParam(this.imageId,this.range).subscribe(
          (response) => {
            console.log("With param: "+response);
            this.onComplete();
          },
          (error) => {console.error(error)},
          () => {
            console.log("complete");
          }
        );
      })();
      } else {
        (async () => { 
          this.loadingValue = 0;
          console.log("imageId: "+ this.imageId);
          this.analyzeService.startAnalyze(this.imageId).subscribe(
            (response) => {
              console.log("Without param: "+response);
              this.onComplete();
            },
            (error) => {console.error(error)},
            () => {
              console.log("complete");
              this.onComplete();
            }
          );
        })();
      }
      this.whileRunning();
    } else {
      this.message = "No image to Analyze!";
    }
  }

    whileRunning() {
    this.isRunning = true;
    console.log("while running")
    this.loadingValue = 0;
    const timer = interval(5000);
    timer.pipe(takeWhile(() => this.loadingValue < 101)).subscribe(
      () => {
        this.getStatus();
        console.log(this.loadingValue);
        if (this.loadingValue == 100) {
          this.loadingValue++;
          this.onComplete();
        }
      }
    );   
  }

  getStatus(): void {
    this.analyzeService.getStatus(this.imageId).subscribe(
      (res) => {
        this.loadingValue = res["startshema"];
      }
    );
    //For testing: this.loadingValue++;
      
  }

  onComplete() {
    this.isRunning = false;
    this.hasResult = true;
  }

  onStop() {
    this.isRunning = false;
  }
  
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
