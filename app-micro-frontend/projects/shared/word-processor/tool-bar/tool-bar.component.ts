import { Component, ElementRef, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { toolbarButtons } from '../toolbar-buttons';
import { WordProcessorService } from '../word-processor.service';
import { TableComponent } from '../table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';


export interface WordProcessorToolbarButton {
  title: string;
  icon: string;
  iconText?: string;
  onClick?: (event: CustomeToolbarButtonClickEvent) => void;
}

export interface CustomeToolbarButtonClickEvent {
  selectedRange: Range;
  event: any;
}

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  standalone: true,
  imports: [
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    TableComponent
],
})
export class ToolBarComponent implements OnInit {
  @Input()
  selectedToolBarButtons: any[];

  @Input()
  editArea: ElementRef;

  @Input()
  customToolBarButtons: WordProcessorToolbarButton[] = [];

  @Input()
  customButtons: any[];

  @Input()
  content: string;

  toolbarButtons = toolbarButtons;

  columnWidth: any;

  tableOptionsTop = 0;
  tableOptionsLeft = 0;

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

  constructor(private wordProcessorService: WordProcessorService) {
  }

  currentTr: any;
  currentTd: any;
  showTableOptions: boolean = false;
  showTableOpionsDropDown: boolean = false;

  @Output() onContentChange: EventEmitter<any> = new EventEmitter();
  // @Output() onCleanedHTML: EventEmitter<any> = new EventEmitter();
  @Output() onKeyPressEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomButtonClick: EventEmitter<any> = new EventEmitter();

  @Output() onInsertTable: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  toolbarButtonClick(event: any, tool: any) {

    switch (tool.action) {
      case 'insertTable':
        break;
      case 'formatBlock':
        document.execCommand('formatBlock', false, tool.tag);
        break;
      case 'cleanPlaceholders':
        this.handleCleanedHtml();
        break;
      case 'createLink':
        this.addLink();
        break;
      case 'unlink':
        this.removeLink();
        break;
      default:
        document.execCommand(tool.action);
    }
  }

  customToolbarButtonClick(
    event: any,
    wordProcessorToolbarButton: WordProcessorToolbarButton
  ) {
    if (window.getSelection) {
      let selection = window.getSelection();
      if (selection?.anchorNode?.parentElement?.closest('.editArea')) {
        wordProcessorToolbarButton.onClick({
          selectedRange: selection.getRangeAt(0),
          event,
        });
      }
    }
  }

  setFontSize(size) {
    document.execCommand('formatBlock', false, size.tag);
  }

  insertTable(table) {
    this.onInsertTable.emit(table);
  }

  handleChange(event) {
    this.onContentChange.emit(event.target.innerHTML);
  }

  handleCleanedHtml() {
    let editingArea: any = document.querySelector('#editAreaContent')?.innerHTML;
    let output = this.wordProcessorService.cleanHTML(editingArea);
    document.querySelector('#editAreaContent').innerHTML = output;
  }

  getHighlitedText() {
    // this.editArea.nativeElement;
  }

  onKeyPress($event: any) {
    if (this.onKeyPressEvent) this.onKeyPressEvent.emit($event);
  }

  setWidth() {
    if (this.columnWidth > 0) {
      this.currentTd.setAttribute('width', this.columnWidth);
    }

    this.hideTableOptions();
  }

  tableOptionAction(action: string) {
    let node;
    switch (action) {
      case 'show-options':
        this.showTableOpionsDropDown = true;
        break;
      case 'add-row-above':
        node = this.currentTr.cloneNode(true);
        this.removeAllText(node);
        this.currentTr.insertAdjacentHTML('beforebegin', node.outerHTML);
        this.hideTableOptions();
        break;
      case 'add-row-below':
        node = this.currentTr.cloneNode(true);
        this.removeAllText(node);
        this.currentTr.insertAdjacentHTML('afterend', node.outerHTML);
        this.hideTableOptions();

        break;
      case 'delete-row':
        this.currentTr.outerHTML = '';
        this.hideTableOptions();
        break;
      case 'cancel':
        this.hideTableOptions();
        break;
    }
  }

  hideTableOptions() {
    this.showTableOpionsDropDown = false;
    this.showTableOptions = false;
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

  insertText(html: string) {
    var sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        var el = document.createElement('div');
        el.innerHTML = html;
        var frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection-proccess
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  getCaretPosition(editableDiv: ElementRef) {


    var caretPos = 0,
      sel: any,
      range: any;
    if (window.getSelection()) {
      sel = window.getSelection();

      var tempEl = document.createElement('span');

      tempEl.innerHTML = '<b>sample insert</b>';
      document
        .getSelection()
        .anchorNode.insertBefore(tempEl, editableDiv.nativeElement.firstChild);


      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == editableDiv) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.getSelection() && document.createRange()) {
      range = document.createRange();
      if (range.parentElement() == editableDiv) {
        var tempEl = document.createElement('span');

        editableDiv.nativeElement.insertBefore(
          tempEl,
          editableDiv.nativeElement.firstChild
        );
        var tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint('EndToEnd', range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  }

  addLink() {
    const url = prompt('Enter the URL:');
    if (url) {
      const selectedText = this.getSelectedText();
      const linkText = selectedText ? selectedText : url;
      const link = `<a href="${url}">${linkText}</a>`;
      this.insertLinkText(link);
    }
  }

  removeLink() {
    const selectedText = this.getSelectedText();
    const link = `<a href=".*?">(.*?)<\/a>`;
    const regex = new RegExp(link, 'g');
    const unlinkedText = selectedText.replace(regex, '$1');
    this.replaceSelectedText(unlinkedText);
  }


  getSelectedText(): string {
    const textarea = this.editArea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      return textarea.value.substring(start, end);
    }
    return '';
  }

  insertLinkText(text: string) {
    const textarea = document.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    this.content = textarea.value;
  }

  replaceSelectedText(text: string) {
    const textarea = document.querySelector('textarea');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
    textarea.selectionStart = startPos;
    textarea.selectionEnd = startPos + text.length;
    this.content = textarea.value;
  }
}

/// shared/word-processor/word-processor
