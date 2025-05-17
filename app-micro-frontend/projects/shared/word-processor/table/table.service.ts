import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  mouseOverlisteners = new Map();
  mouseLeaveisteners = new Map();
  tdMouseDownListenders = new Map();
  tdMouseMoveListenders = new Map();
  tdMouseUpListenders = new Map();
  tdMouseOverListenders = new Map();
  clicklisteners = new Map();

  selectedCells: HTMLTableColElement[] = [];

  isMouseDown = false;

  constructor() { }

  //TODO needs perfections
  addTdEventsListeners(td: HTMLElement) {
    if (!this.tdMouseOverListenders.has(td)) {
      td.addEventListener('mouseover', (event) => {
        //event.target.style.cursor = 'col-resize';

        let tdRect = td.getBoundingClientRect();

        if (Math.abs(tdRect.x - event.clientX) < 3) {
          td.style.cursor = 'col-resize';
        } else {
          td.style.cursor = 'col-resize';
          td.style.removeProperty('cursor');
        }
      });
      this.tdMouseOverListenders.set(td, true);
    }

    if (!this.tdMouseDownListenders.has(td)) {
      td.addEventListener('mousedown', (event) => {
        this.isMouseDown = true;
      });
      this.tdMouseDownListenders.set(td, true);
    }

    if (!this.tdMouseMoveListenders.has(td)) {
      td.addEventListener('mousemove', (event) => {
        if (this.isMouseDown) {
          let width = event.clientX - td.offsetLeft;
          let height = event.clientY - td.offsetTop;
          td.style.width = width + 'px';
          td.style.height = height + 'px';
        }
      });

      this.tdMouseMoveListenders.set(td, true);
    }

    td.addEventListener('mouseup', (event) => {
      this.isMouseDown = false;
    });
  }

  addOnMouseOverEvent(
    table: HTMLElement,
    callback: (table: HTMLElement) => void
  ) {
    if (!this.mouseOverlisteners.has(table)) {
      table.addEventListener('mouseover', (event) => {
        this.onMouseOverTableListern(event, table, callback);
      });
      this.mouseOverlisteners.set(table, true);
    }
  }

  async copyTableToClipBoard(table: HTMLElement) {
    const htmlData = new ClipboardItem({
      'text/html': new Blob([table.outerHTML], { type: 'text/html' }),
    });
    await navigator.clipboard.write([htmlData]);
  }

  addOnMouseLeaveEvent(
    table: HTMLElement,
    callback: (table: HTMLElement) => void
  ) {
    if (!this.mouseLeaveisteners.has(table)) {
      table.addEventListener('mouseleave', (event) => {
        this.onMouseOverTableListern(event, table, callback);
      });
      this.mouseLeaveisteners.set(table, true);
    }
  }

  addOnClickEvent(
    table: HTMLElement,
    callback: (
      td: HTMLElement,
      tr: HTMLElement,
      parentTable: HTMLElement
    ) => void
  ) {
    if (!this.clicklisteners.has(table)) {
      table.addEventListener('click', (event) => {
        this.onTableClickListener(event, table, callback);
      });
      this.clicklisteners.set(table, true);
    }
  }

  onMouseOverTableListern(
    event: any,
    table: HTMLElement,
    callback: (table: HTMLElement) => void
  ) {
    callback(table);
  }

  onTableClickListener(
    event: any,
    table: HTMLElement,
    callback: (
      td: HTMLElement,
      tr: HTMLElement,
      parentTable: HTMLElement
    ) => void
  ) {
    let target = event.target;
    let td: HTMLElement = target.closest('td');
    let tr: HTMLElement = target.closest('tr');
    if (td) {
      callback(td, tr, table);
    }
  }

  onTdFocused(td: HTMLElement) { }
}
