import { TestBed, inject } from '@angular/core/testing';

import { DealService } from './deal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DealService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [DealService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([DealService], (service: DealService) => {
    expect(service).toBeTruthy();
  }));
});