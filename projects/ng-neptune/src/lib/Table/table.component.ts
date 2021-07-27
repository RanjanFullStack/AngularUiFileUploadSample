import { OnInit, Component, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Component({ selector: "nep-table", templateUrl: "./table.component.html" })
export class Table implements OnInit {
  @Input() character: any;
  @Input() columns: string[];
  characters: Observable<any[]>;
  ngOnInit(): void {}
}
export class DataSource {}
