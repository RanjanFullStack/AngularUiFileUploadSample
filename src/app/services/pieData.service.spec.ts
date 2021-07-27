import { TestBed, inject } from '@angular/core/testing';

import { PieDataService } from './pieData.service';

describe('PieDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PieDataService]
    });
  });

  it('should be created', inject([PieDataService], (service: PieDataService) => {
    expect(service).toBeTruthy();
  }));
});