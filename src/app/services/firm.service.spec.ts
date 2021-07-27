import { TestBed, inject } from '@angular/core/testing';

import { FirmService } from './firm.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FirmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [FirmService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([FirmService], (service: FirmService) => {
    expect(service).toBeTruthy();
  }));
});