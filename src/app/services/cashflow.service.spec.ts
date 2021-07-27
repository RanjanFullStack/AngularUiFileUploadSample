import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CashflowService } from './cashflow.service';

describe('CashflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [CashflowService,{provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([CashflowService], (service: CashflowService) => {
    expect(service).toBeTruthy();
  }));
});