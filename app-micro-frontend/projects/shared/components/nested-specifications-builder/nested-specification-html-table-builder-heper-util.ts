import { FlatNestedSpecificationItemView } from './store/model';

export class NestedSpecificationHTMLTableBuilderHelper {
  static tableStyle =
    'width: 100%; border-collapse: collapse; margin-bottom:20px';
  static tableCellStyle = 'border: 1px solid #000000; padding: 4px';

  static codeWidth = '90px';
  static unitOfMeasureWidth = '100px';
  static quantityWidth = '80px';
  static unitRateWidth = '120px';
  static totalWidth = '120px';

  static buildNestedSpecificationHTMLView(
    item: FlatNestedSpecificationItemView[]
  ): string {
    let html = '';

    for (let i = 0; i < item.length; i++) {
      if (item[i].type == 'GroupItem') {
        html += this.buildNestedSpecificationGroupItem(item[i]);
      }

      if (item[i].type == 'ItemDescription') {
        html += this.buildNestedSpecificationDescriptionItem(item[i]);
      }

      if (item[i].type == 'NestedSpecificationTableHeader') {
        html += this.buildNestedSpecificationHTMLTableHeader(item[i]);
      }

      let isLastItemInTable = false;

      try {
        if (
          item[i + 1].type != 'NestedSpecificationItem' &&
          item[i].type == 'NestedSpecificationItem'
        ) {
          isLastItemInTable = true;
        }
      } catch (e) {}

      if (item[i].type == 'NestedSpecificationItem') {
        html += this.buildNestedSpecificationRow(item[i], isLastItemInTable);
      }
    }

    return html;
  }

  static buildNestedSpecificationHTMLTableHeader(
    item: FlatNestedSpecificationItemView
  ): string {
    let html = `<div style="padding-bottom:10px"><table style="${this.tableStyle}">`;
    html += '<thead>';
    html += '<tr>';
    html += `<th style="${this.tableCellStyle}; text-align:left; width:${this.codeWidth}">Code/SN</th>`;
    html += `<th style="${this.tableCellStyle}; text-align:left;">Description</th>`;
    html += `<th style="${this.tableCellStyle}; text-align:left; width:${this.unitOfMeasureWidth}">Unit of Measure</th>`;

    html += `<th style="${this.tableCellStyle}; width:${this.quantityWidth}; text-align:right">Quantity</th>`;
    html += `<th style="${this.tableCellStyle}; width:${this.unitRateWidth}; text-align:right">Unit Rate</th>`;
    html += `<th style="${this.tableCellStyle}; width:${this.totalWidth}; text-align:right">Total</th>`;

    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    return html;
  }

  static buildNestedSpecificationRow(
    item: FlatNestedSpecificationItemView,
    isLast: boolean = false
  ): string {
    let html = '<tr>';
    html += `<td style="${this.tableCellStyle}; text-align:left">${item.editableSpecificationItem.code}</td>`;
    html += `<td style="${this.tableCellStyle}; text-align:left">${item.editableSpecificationItem.description}</td>`;
    html += `<td style="${this.tableCellStyle}; text-align:left">${item.editableSpecificationItem.unitOfMeasure}</td>`;
    html += `<td style="${this.tableCellStyle}; text-align:right">${
      item.editableSpecificationItem.value
        ? item.editableSpecificationItem.value
        : ''
    }</td>`;

    html += `<td style="${this.tableCellStyle}; text-align:right">${
      item.editableSpecificationItem.unitRate
        ? item.editableSpecificationItem.unitRate
        : ''
    }</td>`;
    html += `<td style="${this.tableCellStyle}; text-align:right">${
      item.editableSpecificationItem.total
        ? item.editableSpecificationItem.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : ''
    }</td>`;

    html += '</tr>';

    if (isLast) {
      html += '</tbody>';
      html += '</table></div>';
    }

    return html;
  }

  static buildNestedSpecificationDescriptionItem(
    item: FlatNestedSpecificationItemView
  ): string {
    let codeText = '';
    if (item.nestedSpecificationItem.code) {
      codeText = item.nestedSpecificationItem.code + ': ';
    }
    return `<div>${codeText} ${item.nestedSpecificationItem.description}</div>`;
  }

  static buildNestedSpecificationGroupItem(
    item: FlatNestedSpecificationItemView
  ): string {
    return `<div><strong>${item.nestedSpecificationGroupItem.name}</strong></div>`;
  }
  static buildLotHeader(
    lotNumber: string,
    lotDescription: string,
    showLotNumber: boolean = false
  ): string {
    let html = '';

    if (showLotNumber) {
      html += `<div style='text-align:center'><strong>Lot Number: ${lotNumber}</strong></div>`;
    }
    html += `<div style='margin-bottom:10px; text-align:center'><strong>Lot Description: ${lotDescription}</strong></div>`;

    return html;
  }
}
