import { TestBed } from '@angular/core/testing';

import { ImageToAppService } from './image-to-app.service';

describe('ImageToAppService', () => {
  let service: ImageToAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageToAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
