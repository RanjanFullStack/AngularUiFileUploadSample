import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import {
  OpenDocumentComponent,
  DocumentError,
} from "./open-document.component";
import { ToastModule } from "primeng/toast";
import { CalendarModule, AutoCompleteModule } from "primeng/primeng";
import { TypeAheadControlComponent } from "../custom-controls/typeahead-control.component";
import { ConfirmModalComponentComponent } from "./../../../../projects/ng-neptune/src/lib/confirm-modal-component/confirm-modal.component";
import { FormsModule } from "@angular/forms";
import { Button } from "./../../../../projects/ng-neptune/src/lib/Button/button.component";
import { RouterTestingModule } from "@angular/router/testing";
import { DocumentService } from "src/app/services/document.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountService } from "src/app/services/account.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";

describe("OpenDocumentComponent", () => {
  let component: OpenDocumentComponent;
  let fixture: ComponentFixture<OpenDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastModule,
        CalendarModule,
        FormsModule,
        AutoCompleteModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [
        OpenDocumentComponent,
        TypeAheadControlComponent,
        ConfirmModalComponentComponent,
        Button,
      ],
      providers: [
        DocumentService,
        AccountService,
        FirmService,
        FundService,
        PortfolioCompanyService,
        DealService,
        { provide: "BASE_URL", baseUrl: "localhost" },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDocumentComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("document error validation check at object init", () => {
    let documentError: DocumentError = new DocumentError();
    expect(documentError.IsError()).toBeFalsy();
  });

  it("document error validation check after reset called", () => {
    let documentError: DocumentError = new DocumentError();
    documentError.ShowDocTypeError = true;
    documentError.Reset();
    expect(documentError.IsError()).toBeFalsy();
  });
});
