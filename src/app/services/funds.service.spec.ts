import { TestBed, inject } from "@angular/core/testing";

import { FundService } from "./funds.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("FundsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FundService, { provide: "BASE_URL", baseUrl: "localhost" }],
      imports: [HttpClientTestingModule],
    });
  });

  it("should be created", inject([FundService], (service: FundService) => {
    expect(service).toBeTruthy();
  }));
});
