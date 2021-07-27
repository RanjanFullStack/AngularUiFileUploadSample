import { TestBed, inject } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [FileUploadService,{provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));
});