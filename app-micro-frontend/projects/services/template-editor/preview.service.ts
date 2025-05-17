import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import { Tender } from '../../modules/nest-app/store/tender/tender.model';

interface TemplateToPrevew {
  template: string;
  tender: Tender;
}

interface PrevieDocument {
  preview: string;
  errors: any;
  status: 'success' | 'fail';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PreviewService {
  templateToPreview: TemplateToPrevew | undefined = undefined;

  constructor() { }

  ppraLogo: string = '';

  quickPreview(text: string, fullTender: any) {
    return null;
  }

  putIListOfGoods(text: string, items: any[]) {
    const searchRegExp = new RegExp('{LIST_OF_GOODS}', 'g');

    let itemsText = this.getItemsTable(items);
    text = text.replace(searchRegExp, itemsText);

    return text;
  }

  placeSpecifications(text: string, items: any[]) {
    const searchRegExp = new RegExp('{PE_SPECIFICATION}', 'g');

    let itemsText = this.putSpecifications(items);
    text = text.replace(searchRegExp, itemsText);

    return text;
  }

  putSpecifications(items: any[]) {
    let tableHeahder = `<tr>
      <td style="border: 1px solid black; min-height: 40px">Item</td>
      <td style="border: 1px solid black; min-height: 40px">Required Technical Specifications</td>
      </tr>`;

    let trs = '';
    for (let i = 0; i < items.length; i++) {
      trs += `<tr>
      <td style="border: 1px solid black; min-height: 40px">${i + 1}. ${items[i].description
        }</td>
      <td style="border: 1px solid black; min-height: 40px">${this.setSpecifications(
          items[i].specifications
        )}</td>
      </tr>`;
    }

    return `<table
     bordercolor="#000000"
  width="100%"
  border="1"
  style="border-collapse: collapse; table-layout: fixed">${tableHeahder}${trs}<table>`;
  }

  setSpecifications(specs: any[]) {
    let specsString = '';
    for (let i = 0; i < specs.length; i++) {
      specsString += `<div styel='width:100px; display:block'><b>${specs.toString()}:</b></div>
      <div>${specs[i].value}</div>`;
    }
  }

  getItemsTable(items: any[]) {
    let tableHeahder = `<tr>
      <td style="border: 1px solid black; min-height: 40px">Item No.</td>
      <td style="border: 1px solid black; min-height: 40px">Brief description of Goods</td>
      <td style="border: 1px solid black; min-height: 40px">Quantiy</td>
      <td style="border: 1px solid black; min-height: 40px">Unit of Measuer</td>
      <td style="border: 1px solid black; min-height: 40px">Delivery Completion Period</td>
      <td style="border: 1px solid black; min-height: 40px">Delivery Point/Site</td>
      </tr>`;

    let trs = '';
    for (let i = 0; i < items.length; i++) {
      trs += `<tr>
      <td style="border: 1px solid black; min-height: 40px">${i + 1}</td>
      <td style="border: 1px solid black; min-height: 40px">${items[i].description
        }</td>
      <td style="border: 1px solid black; min-height: 40px">${items[i].quantity
        }</td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      </tr>`;
    }

    return `<table
     bordercolor="#000000"
  width="100%"
  border="1"
  style="border-collapse: collapse; table-layout: fixed">${tableHeahder}${trs}<table>`;
  }

  getSpecificationsTable(items: any[]) {
    let tableHeahder = `<tr>
      <td style="border: 1px solid black; min-height: 40px">Item No.</td>
      <td style="border: 1px solid black; min-height: 40px">Brief description of Goods</td>
      <td style="border: 1px solid black; min-height: 40px">Quantiy</td>
      <td style="border: 1px solid black; min-height: 40px">Unit of Measuer</td>
      <td style="border: 1px solid black; min-height: 40px">Delivery Completion Period</td>
      <td style="border: 1px solid black; min-height: 40px">Delivery Point/Site</td>
      </tr>`;

    let trs = '';
    for (let i = 0; i < items.length; i++) {
      trs += `<tr>
      <td style="border: 1px solid black; min-height: 40px">${i + 1}</td>
      <td style="border: 1px solid black; min-height: 40px">${items[i].description
        }</td>
      <td style="border: 1px solid black; min-height: 40px">${items[i].quantity
        }</td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      <td style="border: 1px solid black; min-height: 40px"></td>
      </tr>`;
    }

    return `<table
     bordercolor="#000000"
  width="100%"
  border="1"
  style="border-collapse: collapse; table-layout: fixed">${tableHeahder}${trs}<table>`;
  }

  putImage(text: string, placeHolder: string, imageBase64String: string) {
    let image = this.getHTMLBaseImage(imageBase64String);

    const searchRegExp = new RegExp(placeHolder, 'g');
    text = text.replace(searchRegExp, image);

    return text;
  }

  getHTMLBaseImage(imageBase64String: string) {
    return `<img style=" width:120px; margin:auto " src="${imageBase64String}"  />`;
  }

  wrapPlaceHoldersWithcCurryBrackets(transformedTender) {
    let newObject = {};

    for (const [key, value] of Object.entries(transformedTender)) {
      newObject[`{${key}}`] = value;
    }

    return newObject;
  }

  doTabular(text: string, tender: any) {
    let res = this.quickRepopulateTabular(text, tender);


    return res;
  }

  quickRepopulateTabular(text: string, tender: any) {
    return null;
  }

  convertToTable(items: any[]) {

    let htmlTable = '';

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].children.length; j++) {
        if (j == 0) {
          htmlTable += `<tr><td valign="top" rowspan="${items[i].children.length
            }"><strong>${i + 1}.</strong></td><td valign="top" rowspan="${items[i].children.length
            }"><strong>${items[i].text}</strong></td><td valign="top" >${i + 1}.${j + 1
            }</td><td>${items[i].children[j].text}</td></tr>`;
        } else {
          htmlTable += `<tr><td valign="top" >${i + 1}.${j + 1}</td><td>${items[i].children[j].text
            }</td></tr>`;
        }
      }
    }
    return (
      '<table class="preview_table non-stripped">' + htmlTable + '</table>'
    );
  }

  do(templateToPreview: TemplateToPrevew | any): any {
    return null;
  }

  putCurrentDate(capturedValues: any): any {
    if (capturedValues.match['{PUBLICATION_DATE}']) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();

      let _today = dd + '/' + mm + '/' + yyyy;

      capturedValues.match['{PUBLICATION_DATE}'] = _today;
    }
    return capturedValues;
  }

  putLogo(capturedValues: any): any {
    if (capturedValues.match['{PE_LOGO}']) {
      capturedValues.match['{PE_LOGO}'] =
        '<img style="margin:auto" src="http://localhost:4200/assets/dummy/gov-logo.png">';
    }
    return capturedValues;
  }
}
