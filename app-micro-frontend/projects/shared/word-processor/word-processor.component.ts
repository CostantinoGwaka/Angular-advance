import { WordProcessorService } from 'src/app/shared/word-processor/word-processor.service';
import { cloneDeep } from 'lodash';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { toolbarButtons } from './toolbar-buttons';
import { WordProcessorToolbarButton, ToolBarComponent } from './tool-bar/tool-bar.component';
import { TableService } from './table/table.service';
import { DoNotSanitizePipe } from './pipes/do-not-sanitize.pipe';
import { HtmlCodeEditorComponent } from './html-code-editor/html-code-editor.component';
import { TableCellPropertiesComponent } from './table/table-cell-properties/table-cell-properties.component';
import { TablePropertiesComponent } from './table/table-properties/table-properties.component';
import { DisableTypingInsideConditionBlockDirective } from '../directives/disable-typing-inside-condition-block.directive';


export enum TOOL_BAR_POSITION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export interface AdditionalOption {
  toolBarPosition: TOOL_BAR_POSITION;
  editAreaBorder: boolean;
}

@Component({
  selector: 'word-processor',
  templateUrl: './word-processor.component.html',
  styleUrls: ['./word-processor.component.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    DisableTypingInsideConditionBlockDirective,
    TablePropertiesComponent,
    TableCellPropertiesComponent,
    HtmlCodeEditorComponent,
    DoNotSanitizePipe
  ],
})
export class WordProcessorComponent implements OnInit {
  @ViewChild('activeElement', { read: ElementRef }) activeElement: ElementRef;
  @ViewChild('editAreaRef') editArea: ElementRef;
  @ViewChild('tableOptions', { static: false }) tableOptions: ElementRef;
  @Input() additionalOptions: AdditionalOption = {
    toolBarPosition: TOOL_BAR_POSITION.TOP,
    editAreaBorder: true,
  };

  @Input()
  content: string;

  @Input()
  selectedToolBarButtons: any[];

  @Input()
  customToolBarButtons: WordProcessorToolbarButton[];

  @Input()
  customClassTopContainer: string = '';

  @Input()
  customClassBottomContainer: string = '';

  @Input()
  disabled: boolean = false;

  listeners = new Map();

  //   element.style {
  //   border-width: 1.5px;
  //   border-radius: 5px;
  //   border-color: #989898;
  //   overflow: auto;
  // }

  tableOptionsTop = 0;
  tableOptionsLeft = 0;

  tablePropertiesTop = 0;
  tablePropertiesLeft = 0;

  history = [];
  currentState = 0;

  allowCodeView: boolean = false;
  showCodeView: boolean = false;

  @Output() onContentChange: EventEmitter<any> = new EventEmitter();
  // @Output() onCleanedHTML: EventEmitter<any> = new EventEmitter();
  @Output() onKeyPressEvent: EventEmitter<any> = new EventEmitter();
  @Output() onKeyDownEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private eRef: ElementRef,
    private wordProcessorService: WordProcessorService,
    private tableService: TableService
  ) { }

  currentTr: HTMLElement;
  currentTd: HTMLElement;
  currentTable: HTMLElement;
  showTableOptions: boolean = false;
  showTableProperties: boolean = false;
  mouseIsInTableProperties: boolean = false;
  currentTrPosition: number;

  tableCellTarget: any;

  isInCellsSelectionMode: boolean = false;

  selectedCells: HTMLTableColElement[] = [];

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (this.isInCellsSelectionMode) {
      this.selectCell(event);
    } else {
      if (!this.mouseIsInTableProperties) {
        this.clearSelectedCells();
      }
    }

    if (event.target?.parentNode?.className == 'tableAddable') {
      // this.hideTableOptions();
      this.showTableOptions = true;
      this.tableCellTarget = event.target;
      this.setTableOptionsPosition();
    } else {
      if (this.showTableOptions) {
        // this.showTableOptions = false;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.setTableOptionsPosition(); // Not working as intended, will come back
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent): void {
    e.preventDefault();

    let text = this.wordProcessorService.cleanHTML(
      e.clipboardData.getData('text/html')
    );

    document.execCommand('insertHTML', false, text);
  }

  @HostListener('document:keydown.control', ['$event'])
  onCtrlDown(event: KeyboardEvent) {
    this.enterCellsSelectionMode();
  }

  @HostListener('document:keydown.meta', ['$event'])
  onCmdDown(event: KeyboardEvent) {
    this.enterCellsSelectionMode();
  }

  @HostListener('document:keyup.control', ['$event'])
  onCtrlUp(event: KeyboardEvent) {
    this.leaveCellsSelectionMode();
  }

  @HostListener('document:keyup.meta', ['$event'])
  onCmdUp(event: KeyboardEvent) {
    this.leaveCellsSelectionMode();
  }

  enterCellsSelectionMode() {
    this.isInCellsSelectionMode = true;
  }

  leaveCellsSelectionMode() {
    this.isInCellsSelectionMode = false;
  }

  onMouseMoveInEditArea() {
    this.getAllTablesAndAddEventListner();
  }

  setTableOptionsPosition() {
    if (this.tableCellTarget) {
      this.currentTr = this.tableCellTarget.parentNode;
      this.currentTd = this.tableCellTarget;
    }

    if (this.currentTd) {
      let rect = this.currentTd.getBoundingClientRect();
      this.tableOptionsTop = rect.bottom;
      this.tableOptionsLeft = rect.left;
    }
  }

  onCellsActionFinished() {

    this.clearSelectedCells();
  }

  toggleView() {
    this.showCodeView = !this.showCodeView;
  }

  clearSelectedCells() {
    let cells = this.editArea.nativeElement.querySelectorAll('td');
    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.remove('selectedTD');
    }
    this.selectedCells = [];
  }

  toolbarButtons = toolbarButtons;

  fontSizes = [
    {
      id: 'h1',
      text: 'Heading 1',
      tag: '<h1>',
    },
    {
      id: 'h2',
      text: 'Heading 2',
      tag: '<h2>',
    },
    {
      id: 'h3',
      text: 'Heading 3',
      tag: '<h3>',
    },
    {
      id: 'p',
      text: 'Normal',
      tag: '<p>',
    },
  ];

  ngOnInit(): void { }

  toolbarButtonClick($event: any, tool: any) {

    switch (tool.action) {
      case 'insertTable':
        break;
      case 'formatBlock':
        document.execCommand('formatBlock', false, tool.tag);
        break;
      default:
        document.execCommand(tool.action);
    }
  }

  setFontSize(size) {
    document.execCommand('formatBlock', false, size.tag);
  }

  insertTable(table) {
    this.editArea.nativeElement.focus();
    document.execCommand('insertHTML', false, table);
  }

  handleChange(event: any) {
    let cleanedHTML = this.wordProcessorService.cleanHTML(
      event.target.innerHTML
    );
    this.onContentChange.emit(cleanedHTML);
  }

  getHighlitedText() {
    this.editArea.nativeElement;
  }

  onKeyPress($event: any) {
    if (this.onKeyPressEvent) this.onKeyPressEvent.emit($event);
  }

  onKeyDown($event: any) {
    if (this.onKeyDownEvent) this.onKeyDownEvent.emit($event);
  }

  initializeHistory() {
    this.history = [];
    this.currentState = 0;
  }

  getAllTablesAndAddEventListner() {
    let tables = this.editArea.nativeElement.querySelectorAll('table');
    tables.forEach((table: any) => {
      this.tableService.addOnMouseOverEvent(table, this.onMouseOverTable);
      this.tableService.addOnMouseLeaveEvent(table, this.onMouseLeaveTable);
      this.tableService.addOnClickEvent(table, this.onTDClick);
    });
  }

  onMouseLeaveTable = (table: HTMLElement) => {
    let tableRec = table.getBoundingClientRect();

    setTimeout(() => {
      if (!this.mouseIsInTableProperties) {
        this.showTableProperties = false;
      }
    }, 200);
  };

  onMouseOverTable = (table: HTMLElement) => {
    this.currentTable = table;
    this.showTableProperties = true;

    let editAreaRect = this.editArea.nativeElement.getBoundingClientRect();
    let rect = this.currentTable.getBoundingClientRect();

    this.tablePropertiesTop = rect.top - editAreaRect.top - 10;
    this.tablePropertiesLeft = rect.left - editAreaRect.left - 5;
  };

  onTDClick = (td: HTMLElement, tr: HTMLElement, table: HTMLElement) => {
    this.showTableOptions = true;

    this.currentTr = tr;
    this.currentTd = td;
    this.currentTable = table;

    if (this.currentTd) {
      let editAreaRect = this.editArea.nativeElement.getBoundingClientRect();
      let rect = this.currentTd.getBoundingClientRect();
      this.tableOptionsTop = rect.top - editAreaRect.top;
      this.tableOptionsLeft = rect.width + rect.left - editAreaRect.left;
    }
  };

  selectCell(event: any) {
    var index = this.selectedCells.indexOf(event.target.closest('td'));
    if (index === -1) {
      this.selectedCells.push(event.target.closest('td'));
      event.target.closest('td')?.classList.add('selectedTD');
    } else {
      this.selectedCells.splice(index, 1);
      event.target.closest('td')?.classList.remove('selectedTD');
    }
  }
}
