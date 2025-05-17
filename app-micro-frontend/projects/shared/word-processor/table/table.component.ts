import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { prededefinedTables } from './predefined-tables';
import { MatRippleModule } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'word-processor-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [
    FormsModule,
    MatButtonModule,
    MatRippleModule
],
})
export class TableComponent implements OnInit {
  @Output() onTableGenerated: EventEmitter<any> = new EventEmitter();

  rows: number = 1;
  columns: number = 2;

  constructor() { }

  prededefinedTables = prededefinedTables;

  ngOnInit(): void {
    for (let i = 0; i < this.prededefinedTables.length; i++) {
      fetch(
        `assets/word-processor-templates/tables/${prededefinedTables[i].filePath}`
      )
        .then((res) => res.text())
        .then((table) => (prededefinedTables[i].table = table));
    }
  }

  insertTable() {
    let table = this.generateTable();
    this.onTableGenerated.emit(table + '<br/>');
  }
  insertPredefinedTable(table) {
    this.onTableGenerated.emit(table.table + '<br/>');
  }

  getTds(total: number): string {
    let cells = '';
    for (let j = 0; j < total; j++) {
      cells +=
        '<td valign="top" style="border: 1px solid black;min-height:40px;padding:5px"><br></td>';
    }
    return cells;
  }

  generateTable(): string {
    let rowsString = '';
    for (let i = 0; i < this.rows; i++) {
      rowsString +=
        '<tr class="tableAddable">' + this.getTds(this.columns) + '</tr>';
    }
    return `<table bordercolor="#ff0000" width="100%" border='1' style='border-collapse:collapse; table-layout: fixed;' class="nest-auto-table">${rowsString}</table>`;
  }
}
