import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './index';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../services/account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PermissionService } from '../services/permission.service';

describe('IndexGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule,HttpClientTestingModule],
      providers: [AuthGuard,AccountService,{ provide: "BASE_URL", baseUrl: "localhost" },PermissionService]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});

