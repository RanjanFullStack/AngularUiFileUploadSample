import { TestBed, inject } from '@angular/core/testing';

import { PortfolioCompanyService } from './portfolioCompany.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PortfolioCompanyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [PortfolioCompanyService,
      {provide:'BASE_URL',baseUrl:"localhost"}]
    });
  });

  it('should be created', inject([PortfolioCompanyService], (service: PortfolioCompanyService) => {
    expect(service).toBeTruthy();
  }));
});