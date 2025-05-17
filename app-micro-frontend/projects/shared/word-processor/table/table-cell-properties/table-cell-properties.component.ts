import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { WordProcessorService } from '../../word-processor.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-table-cell-properties',
  templateUrl: './table-cell-properties.component.html',
  styleUrls: ['./table-cell-properties.component.scss'],
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    FormsModule
],
})
export class TableCellPropertiesComponent implements OnInit {
  @Input()
  table: HTMLElement;

  @Input()
  currentTr: HTMLElement;

  @Input()
  selectedCells: HTMLElement[] = [];

  @Input()
  currentTrPosition: number;

  @Input()
  currentTd: HTMLElement;

  @Output()
  onActionFinished: EventEmitter<any> = new EventEmitter();

  showTableOpionsDropDown: boolean = false;
  showTableOptions: boolean = false;
  mouseInProperties: boolean = false;
  columnWidth: any;
  rowValue: any;

  rowOptions = [
    { value: 'setWidth', name: 'Column Width' },
    { value: 'setHeight', name: 'Column Height' },
    { value: 'colSpan', name: 'Col Span' },
    { value: 'rowSpan', name: 'Row Span' },
  ];

  constructor(private wordProcessorService: WordProcessorService) {
    this.rowValue = this.rowOptions[0]?.value || '';
  }

  ngOnInit(): void { }

  @HostListener('document:click', ['$event'])
  documentClick(event: Event): void {
    if (!this.mouseInProperties) {
      this.showTableOpionsDropDown = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: Event): void {
    this.mouseInProperties = true;
  }

  tableOptionAction(action: string) {
    switch (action) {
      case 'show-options':
        this.showTableOpionsDropDown = true;
        break;
      case 'add-row':
        this.insertRow('beforebegin');
        this.hideTableOptions();
        break;
      case 'delete-row':
        this.deleteRow();
        this.hideTableOptions();
        break;

      case 'merge-cells':
        this.mergeCells();
        this.hideTableOptions();
        break;
    }
  }

  addCorrectRowSpans(table: HTMLTableElement): HTMLTableElement {
    let rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
      let previousRow = rows[i - 1];
      let currentRow = rows[i];
      let previoiusCells = previousRow.cells;
      let currentCells = currentRow.cells;

      if (currentCells.length < previoiusCells.length) {
      }
    }

    return table;
  }

  /*
//Reduce rowspans
1. get a row from table
2. loop through each cell and check if a cell has rowspan>1
3. if a cell has rowspan>1 then use the value of rowspan + rowIndex to find  the rows below the parent row number of cells >= to the number of cells of parent row
4. if the rows below have more cells, substract rowspan by the difference
5. when the loop in step 2 is finished, repeat step 1 until all rows are finished
*/

  correctRowSpans(table) {
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];
      for (let j = 0; j < row.cells.length; j++) {
        let cell = row.cells[j];
        if (cell.rowSpan > 1) {
          let parentRow = row;

          for (let k = i; k < i + cell.rowSpan; k++) {
            let rowBelow = table.rows[i + cell.rowSpan];

            if (rowBelow && rowBelow.cells.length > parentRow.cells.length) {
              //
              //   'rowBelow.cells.length > parentRow.cells.length',
              //   rowBelow.cells.length
              // );
              cell.rowSpan =
                cell.rowSpan - (rowBelow.cells.length - parentRow.cells.length);
            }
          }
        }
      }
    }
  }

  getAboveRowWithRowSpanAffectingAGivenCellInARow(
    cell: HTMLTableCellElement,
    table: HTMLTableElement
  ): HTMLTableRowElement {
    let foundRow: HTMLTableRowElement = null;

    let rows = table.getElementsByTagName('tr');

    // for(let i=0;i<rows.length;i++){
    //   if()
    // }

    return foundRow;
  }

  mergeCells() {
    for (let i = 0; i < this.selectedCells.length; i++) {
      this.selectedCells.sort(
        (a: HTMLTableCellElement, b: HTMLTableCellElement) => {
          return a.parentNode['rowIndex'] - b.parentNode['rowIndex'];
        }
      );
    }
    this.mergeRows();
  }

  mergeRows() {
    let newTable: HTMLTableElement = this.table.cloneNode(
      true
    ) as HTMLTableElement;

    let rows = newTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
      if (i == this.selectedCells[0].parentNode['rowIndex']) {
        let totalRowSpans = this.selectedCells.reduce(
          (prev: number, cell: HTMLTableCellElement) => prev + cell.rowSpan,
          0
        );

        rows[i].cells[this.selectedCells[0]['cellIndex']].rowSpan =
          totalRowSpans;

        for (let j = i + 1; j < totalRowSpans; j++) {
          let rowCells = rows[j].cells;

          for (let k = 0; k < rowCells.length; k++) {
            for (let l = 0; l < this.selectedCells.length; l++) {
              if (
                this.selectedCells[l].parentNode['rowIndex'] == j &&
                this.selectedCells[l]['cellIndex'] == rowCells[k]['cellIndex']
              ) {
                rowCells[k].remove();
              }
            }
          }
        }

        break;
      }
    }

    this.replaceCurrentTableWithModifiedTable(newTable);
  }

  deleteRow() {
    let node: any;
    node = this.currentTr.cloneNode(true);

    let newTable: HTMLTableElement = this.table.cloneNode(
      true
    ) as HTMLTableElement;

    let rows = newTable.getElementsByTagName('tr');
    rows[this.currentTr['rowIndex']].remove();

    this.correctRowSpans(this.table);

    this.replaceCurrentTableWithModifiedTable(newTable);
  }

  deleteCell(div) {
    let tdToDelete = this.currentTd;

    if (!tdToDelete || tdToDelete.tagName !== 'TD') {
      console.error('Invalid <td> element.');
      return;
    }

    let row = tdToDelete.parentElement;
    if (!row || row.tagName !== 'TR') {
      console.error('Invalid parent <tr> element.');
      return;
    }

    row.removeChild(tdToDelete);
  }

  replaceCurrentTableWithModifiedTable(modifiedTable: HTMLTableElement) {
    this.wordProcessorService.selectElement(this.table);
    document.execCommand('insertHTML', false, modifiedTable.outerHTML);
  }

  insertRow(position: InsertPosition) {
    let node: any;
    node = this.currentTr.cloneNode(true);

    this.emptyCellsContent(node as HTMLTableRowElement);
    this.removeRowSpansFromTr(node);

    let newTable: HTMLTableElement = this.table.cloneNode(
      true
    ) as HTMLTableElement;

    let rows = newTable.getElementsByTagName('tr');

    if (rows[this.currentTr['rowIndex'] + 1]) {
      rows[this.currentTr['rowIndex'] + 1].insertAdjacentHTML(
        position,
        node.innerHTML
      );
    } else {
      newTable.appendChild(node);
    }

    this.increaseRowSpansIfNecessary(
      newTable,
      this.currentTr as HTMLTableRowElement
    );

    this.replaceCurrentTableWithModifiedTable(newTable);
  }

  increaseRowSpansIfNecessary(
    table: HTMLElement,
    copiedRow: HTMLTableRowElement
  ) {
    let foundRows: { row: HTMLTableRowElement; cellIndex: number }[] = [];

    let rows = table.getElementsByTagName('tr');
    let rowIndex = copiedRow['rowIndex'];

    for (let i = 0; i < rows.length; i++) {
      let cells = rows[i].cells;

      if (i > rowIndex) {
        break;
      }
      for (let j = 0; j < cells.length; j++) {
        let cell = cells[j];
        if (cell.rowSpan > 1 && cell.rowSpan + i > rowIndex) {
          foundRows.push({
            row: rows[i],
            cellIndex: j,
          });
        }
      }
    }

    if (foundRows.length > 0) {
      for (let i = 0; i < foundRows.length; i++) {
        let cell = foundRows[i].row.cells[foundRows[i].cellIndex];
        cell.rowSpan++;
      }
    }
  }

  removeRowSpansFromTr(row: HTMLTableRowElement) {
    let cells = row.cells;
    for (let j = 0; j < cells.length; j++) {
      let cell = cells[j];
      if (cell.hasAttribute('rowspan')) {
        cell.remove();
      }
    }
  }

  increaseRowSpanCount(row: HTMLTableRowElement, count: number) {
    for (let j = 0; j < row.cells.length; j++) {
      let cell = row.cells[j];
      if (cell.rowSpan > 1) {
        cell.rowSpan += count;
        break;
      }
    }
  }

  setWidthOrHeight(action: string) {

    if (this.columnWidth > 0) {
      switch (action) {
        case 'setWidth':
          this.currentTd.setAttribute('width', this.columnWidth);
          this.hideTableOptions();
          break;
        case 'setHeight':
          this.currentTd.setAttribute('height', this.columnWidth);
          this.hideTableOptions();
          break;
        case 'colSpan':
          this.currentTd.setAttribute('colspan', this.columnWidth);
          this.hideTableOptions();
          break;
        case 'rowSpan':
          this.currentTd.setAttribute('rowspan', this.columnWidth);
          this.hideTableOptions();
          break;
      }
    }
  }

  hideTableOptions() {
    this.showTableOpionsDropDown = false;
    this.showTableOptions = false;
    this.onActionFinished.emit();
  }

  emptyCellsContent(row: HTMLTableRowElement) {
    for (let j = 0; j < row.cells.length; j++) {
      let cell = row.cells[j];
      cell.innerHTML = '<br/>';
    }
  }

  removeAllText(element) {
    var nodes = element.childNodes;
    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType == Node.TEXT_NODE) {
          node.parentNode.removeChild(node);
          i--;
        } else if (node.nodeType == Node.ELEMENT_NODE) {
          this.removeAllText(node);
        }
      }
    }
  }
}
