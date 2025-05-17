import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Injectable({
  providedIn: 'root',
})
export class WordProcessorService {
  constructor() { }

  insertAtRange(range: Range, html: string) {
    if (range) {
      range.deleteContents();

      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node: ChildNode,
        lastNode: ChildNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection-proccess
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
      }
    }
  }

  insertAtSelection(selection: Selection, html: string) {
    var range: Range;

    if (selection.getRangeAt && selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();

      var el = document.createElement('div');
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node: ChildNode,
        lastNode: ChildNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection-proccess
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  cleanHTML(html: string) {
    if (html) {
      html = html.replace(/\n/g, '');
      html = html.replace(/\r/g, '');
      html = html.replace(/&nbsp;/g, ' ');
      html = html.replace(/(font-weight:\s?bolder)/g, 'font-weight: bold');
      html = html.replace(
        /(border-color:\s?black)/g,
        'border: 1px solid black'
      );
      // html = html.replace(/(border-top:\s?none)/g, 'border: 1px solid black');
      html = html.replace(/<!--[\s\S]*?-->/g, '');
      html = html.replace(/<style>.*<\/style>/g, '');
      html = html.replace(
        /--tw(.*?) ;|id="docs.*?"|background-color: var.*?;|text-align: var.*?;|dir="ltr"|align="center"/g,
        ''
      );
      html = html.replace(/style="                          "/g, '');
      html = html.replace(/        /g, '');
      //  html = html.replace(/width="\d+"/g, '');
      html = this.cleanPlaceHolder(html);
    }
    return html;
  }

  clearHTMLTags(match: any) {
    // let conditionOne = /<.>?{.*?}/g;
    let conditionOne = /<.*>{.*?}/g;
    let conditionTwo = /{.*?}/g;
    //fix <> | fix tag with new line | fix space end placeholder before } | fix ' on placeholder
    let regx2 = /(\s*<.*?>\s*)|(<.\s\w+.*\n.\w+">)|(\s*?(?=\}))|(')/g;
    if (conditionOne.test(match)) {
      match = match.replace(regx2, '');
      match = match.replace(/(\s)/g, '_');
      match = match.replace(/(__+)|(-+)/g, '_');
      return '<b>' + match + '</b>';
    } else if (conditionTwo.test(match)) {
      match = match.replace(regx2, '');
      match = match.replace(/'/g, '');
      match = match.replace(/(\s)/g, '_');
      return match.replace(/(__+)|(-+)/g, '_');
    }
  }

  cleanPlaceHolder(html: any) {
    let regEx = /<.>?{.*?}|{.*?}|<.><.>?{.*?}|<.><.><.>?{.*?}/g;
    return html.replace(regEx, this.clearHTMLTags);
  }

  selectElement(element: HTMLElement): Selection {
    let range = document.createRange();
    range.selectNodeContents(element);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    return selection;
  }

  insertAtPreviousCursorPositino(content: string) {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    range.insertNode(document.createTextNode(content));
  }

  insertElement(htmlString: string, element: HTMLElement) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNode(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('insertHTML', false, htmlString);
  }
}
