import { TestBed, inject } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [ReportService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([ReportService], (service: ReportService) => {
    expect(service).toBeTruthy();
  }));
});