import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "documents-table",
  templateUrl: "./documents-table.component.html",
  styleUrls: ["./documents-table.component.css"],
})
export class DocumentsTableComponent implements OnInit {
  @Input() documents;
  @Output() DocumentInfoEvent = new EventEmitter<any>();
  @Output() openDocument = new EventEmitter<any>();
  docName = "45%";
  constructor() {}

  ngOnInit() {}

  OnDocumentInfoClick(id) {
    this.DocumentInfoEvent.emit(id);
  }

  onClick(id) {
    this.openDocument.emit(id);
  }
}
