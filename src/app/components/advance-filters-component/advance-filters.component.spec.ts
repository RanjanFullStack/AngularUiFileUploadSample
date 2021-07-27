import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Button } from './../../../../projects/ng-neptune/src/lib/Button/button.component';
import { CheckboxComponentComponent } from './../../../../projects/ng-neptune/src/lib/checkbox-component/checkbox.component';
import { AccountService } from 'src/app/services/account.service';
import { DocumentService } from 'src/app/services/document.service';
import { AdvanceFiltersComponentComponent } from './advance-filters.component';
import {Observable} from 'rxjs/Rx';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { CalendarModule, MultiSelectModule } from "primeng/primeng";
import { FirmService, } from 'src/app/services/firm.service';
import { FundService } from 'src/app/services/funds.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DealService } from 'src/app/services/deal.service';

describe('AdvanceFiltersComponentComponent', () => {
  let component: AdvanceFiltersComponentComponent; 
  let fixture: ComponentFixture<AdvanceFiltersComponentComponent>;
  let fileFormats = [{name:"PDF",isChecked:false}];
  let docTypes = [{name:"type1",isChecked:false}]; 
  let subDocTypes = [{name:"subtype1",isChecked:false}];
  const categories = ["File Format","Type"];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFiltersComponentComponent,CheckboxComponentComponent,Button],
      imports:[HttpClientTestingModule, FormsModule, CommonModule, CalendarModule,MultiSelectModule ],
      providers:[DocumentService,{ provide: "BASE_URL", baseUrl: "localhost" },AccountService,FirmService,FundService,PortfolioCompanyService,DealService] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getFilterValues', () => {
    fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
    const app = fixture.componentInstance;
    app.fileFormats  = fileFormats;
    app.docTypes = docTypes;
    app.subDocTypes = subDocTypes;
    fixture.detectChanges();
    expect(app).toBeTruthy();
});

it('GetAllFilterCategories', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'GetAllFilterCategories').and.returnValue(Observable.of(categories));
  fixture.detectChanges();
  tick();
  expect(app.filterCategories ).toEqual(categories);
}));

it('GetAllFilterCategories error', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'GetAllFilterCategories').and.returnValue(Observable.throw('error'));
  fixture.detectChanges();
  tick();
  expect(app).toBeTruthy();
}));


it('GetAllFileFormats', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'GetAllFileFormats').and.returnValue(Observable.of(fileFormats));
  fixture.detectChanges();
  tick();
  expect(app.fileFormats).toEqual(fileFormats);
}));

it('GetAllFileFormats error', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'GetAllFileFormats').and.returnValue(Observable.throw('error'));
  fixture.detectChanges();
  tick();
  expect(app).toBeTruthy();
}));

it('GetAllTypes', fakeAsync(() => {
  // fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  // let app = fixture.debugElement.componentInstance;
  // let dataService = fixture.debugElement.injector.get(DocumentService);
  // spyOn(dataService, 'getAllDocumentTypes').and.returnValue(Observable.of([{name:"type1"}]));
  // fixture.detectChanges();
  // tick();
  // expect(app.docTypes).toEqual(docTypes);
}));

it('GetAllTypes error', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'getAllDocumentTypes').and.returnValue(Observable.throw('error'));
  fixture.detectChanges();
  tick();
  expect(app).toBeTruthy();
}));

it('getAllSubDocumentTypes', fakeAsync(() => {
  // fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  // let app = fixture.debugElement.componentInstance;
  // let dataService = fixture.debugElement.injector.get(DocumentService);
  // spyOn(dataService, 'getAllSubDocumentTypes').and.returnValue(Observable.of(subDocTypes));
  // fixture.detectChanges();
  // tick();
  // expect(app.subDocTypes).toEqual(subDocTypes);
}));

it('getAllSubDocumentTypes error', fakeAsync(() => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  let dataService = fixture.debugElement.injector.get(DocumentService);
  spyOn(dataService, 'getAllSubDocumentTypes').and.returnValue(Observable.throw('error'));
  fixture.detectChanges();
  tick();
  expect(app).toBeTruthy();
}));

it('selectFilterCategory', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  let app = fixture.debugElement.componentInstance;
  app.fileFormats = fileFormats;
  app.selectFilterCategory("File Format");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual(fileFormats);
  app.selectFilterCategory("Document Date");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual([]);
  app.docTypes = docTypes;
  app.selectFilterCategory("Type");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual(docTypes);
  app.subDocTypes = subDocTypes;
  app.selectFilterCategory("Sub-Type");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual(subDocTypes);
  app.selectFilterCategory("Firm Name");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual([]);
  app.selectFilterCategory("Fund Name");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual([]);
  app.selectFilterCategory("Portfolio Company");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual([]);
  app.selectFilterCategory("Deal ID");
  fixture.detectChanges();
  expect(app.activeFilterList).toEqual([]);
});

it('updateAdvFiltersList', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.advancedFilters = [];
  app.updateAdvFiltersList(subDocTypes,'Sub-Type');
  fixture.detectChanges();
  expect(app).toBeTruthy();
}); 

it('handleCheckBox', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  let event = {target:{checked:true}};
  app.activeFilterCategory = "File Format";
  app.fileFormats = fileFormats;
  app.handleCheckBox(event,0);
  fixture.detectChanges();
  expect(app.advancedFilters.length).toEqual(1);

  app.activeFilterCategory = "Type";
  app.docTypes = docTypes;
  app.handleCheckBox(event,0);
  fixture.detectChanges();
  expect(app.advancedFilters.length).toEqual(2);

  app.activeFilterCategory = "Sub-Type";
  app.subDocTypes = subDocTypes;
  app.handleCheckBox(event,0);
  fixture.detectChanges();
  expect(app.advancedFilters.length).toEqual(3);

  app.activeFilterCategory = "Document Date";
  app.handleCheckBox(event,0);
  expect(app).toBeTruthy();

  app.activeFilterCategory = "Firm Name";
  app.handleCheckBox(event,0);
  expect(app).toBeTruthy();

  app.activeFilterCategory = "Fund Name";
  app.handleCheckBox(event,0);
  expect(app).toBeTruthy();

  app.activeFilterCategory = "Portfolio Company";
  app.handleCheckBox(event,0);
  expect(app).toBeTruthy();

  app.activeFilterCategory = "Deal ID";
  app.handleCheckBox(event,0);
  expect(app).toBeTruthy();
});

it('onApplyFilters', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.fileFormats = fileFormats;
  app.docTypes = docTypes;
  app.subDocTypes = subDocTypes;
  app.onApplyFilters();
  fixture.detectChanges();
  expect(app).toBeTruthy();
});

it('onCancelFilters', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.DocFormats = fileFormats;
  app.appliedDocTypes = docTypes;
  app.appliedSubDocTypes = subDocTypes;
  app.onCancelFilters();
  fixture.detectChanges();
  expect(app).toBeTruthy();

  app.ResetAdvFilters = true;
  app.fileFormats = fileFormats;
  app.docTypes = docTypes;
  app.subDocTypes = subDocTypes;
  app.onCancelFilters();
  fixture.detectChanges();
  expect(app).toBeTruthy();

});

it('clearAll', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.clearAll();
  fixture.detectChanges();
  expect(app).toBeTruthy();
});

it('onChangeDate1', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.onChangeFromDate(new Date());
  app.onChangeToDate(new Date());
  fixture.detectChanges();
  expect(app).toBeTruthy();
}); 

it('onChangeDate2', () => {
  // @Rewati-Hangirkar please fix the test case
  // fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  // const app = fixture.componentInstance;
  // app.toDate = null;
  // app.onChangeFromDate(new Date());
  // app.fromDate = null;
  // app.onChangeToDate(new Date());
  // fixture.detectChanges();
  // expect(app).toBeTruthy();
});

it('onChangeDate3', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.onChangeFromDate(null);
  app.onChangeToDate(null);
  fixture.detectChanges();
  expect(app).toBeTruthy();
}); 

it('onChangeDate4', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.toDate = new Date();
  app.onChangeFromDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  app.fromDate = new Date(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  app.onChangeToDate(new Date());
  fixture.detectChanges();
  expect(app).toBeTruthy();
}); 

it('updateAdvFiltersDocDate', () => {
  fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
  const app = fixture.componentInstance;
  app.fromDate = new Date();
  app.updateAdvFiltersDocDate();
  app.toDate = new Date();
  app.updateAdvFiltersDocDate();
  fixture.detectChanges();
  expect(app).toBeTruthy();
}); 

});
