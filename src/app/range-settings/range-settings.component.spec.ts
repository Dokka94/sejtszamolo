import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeSettingsComponent } from './range-settings.component';

describe('RangeSettingsComponent', () => {
  let component: RangeSettingsComponent;
  let fixture: ComponentFixture<RangeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
