import { TestBed, inject } from '@angular/core/testing';

import { HttpServiceInterceptor } from './http-service-interceptor';
import { AccountService } from '../services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HttpServiceInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [HttpServiceInterceptor,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" }]
    });
  });

  it('should be created', inject([HttpServiceInterceptor], (service: HttpServiceInterceptor) => {
    expect(service).toBeTruthy();
  }));
});