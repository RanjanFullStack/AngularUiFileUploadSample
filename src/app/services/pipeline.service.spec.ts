import { TestBed, inject } from '@angular/core/testing';

import { PipelineService } from './pipeline.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PipelineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [PipelineService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([PipelineService], (service: PipelineService) => {
    expect(service).toBeTruthy();
  }));
});