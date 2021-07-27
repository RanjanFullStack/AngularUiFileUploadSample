import { TestBed, inject } from '@angular/core/testing';

import { MiscellaneousService } from './miscellaneous.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MiscellaneousService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiscellaneousService, { provide: "BASE_URL", baseUrl: "localhost" }],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject([MiscellaneousService], (service: MiscellaneousService) => {
    expect(service).toBeTruthy();
  }));
});