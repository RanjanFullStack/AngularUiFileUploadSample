import { TestBed, inject } from '@angular/core/testing';
import { FilterService } from './filter.services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DealService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [FilterService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([FilterService], (service: FilterService) => {
    expect(service).toBeTruthy();
  }));
});