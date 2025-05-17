import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

export interface StyleValue {
  value: string;
  unit?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StylesService {
  constructor() { }

  getTableAttributes(htmlElement: HTMLElement): Map<string, string> {
    let attributesMap = new Map<string, string>();
    let attributes = htmlElement.attributes;

    for (var i = 0; i < attributes.length; i++) {
      var attr = attributes.item(i);
      attributesMap.set(attr.name, attr.value);
    }

    return attributesMap;
  }

  getTableTableAttributes(htmlElement: HTMLElement): Map<string, string> {
    let stylesMap = new Map<string, string>();

    let attributes = this.getTableAttributes(htmlElement);

    stylesMap = this.getStyleFromAttributes(attributes);

    this.setSingleWidthProperty(attributes, stylesMap);
    this.setSingleBorderProperty(attributes, stylesMap);

    attributes.set('style', this.converStyleMapToStyleString(stylesMap));

    this.resetAllElementAttributes(htmlElement, attributes);

    return attributes;
  }

  getStyleFromAttributes(attributes: Map<string, string>): Map<string, string> {
    let stylesMap = new Map<string, string>();

    let styleAttribute: string = attributes.get('style');

    if (styleAttribute != null) {
      let stylesArray = styleAttribute.split(';');

      for (let i = 0; i < stylesArray.length; i++) {
        let stylesText = stylesArray[i].split(':');

        let styleName = stylesText[0];
        let styleValue = stylesText[1];

        if (styleName != null && styleValue != null) {
          stylesMap.set(stylesText[0].trim(), stylesText[1].trim());
        }
      }

      stylesMap.set('table-layout', 'fixed');
    }

    return stylesMap;
  }

  setSingleWidthProperty(
    allAttributes: Map<string, string>,
    styleAttribute: Map<string, string>
  ) {
    if (allAttributes.has('width') && styleAttribute.has('width')) {
      let attributeValue = this.getValueAndItsUnitOfMeasure(
        allAttributes.get('width')
      );

      if (attributeValue.unit != '%') {
        styleAttribute.set('width', attributeValue.value + 'pt');
      } else {
        styleAttribute.set('width', attributeValue.value + '%');
      }

      allAttributes.delete('width');
    }
  }

  setSingleBorderProperty(
    allAttributes: Map<string, string>,
    styleAttribute: Map<string, string>
  ) {
    if (allAttributes.has('border') && styleAttribute.has('border')) {
      let attributeValue = this.getValueAndItsUnitOfMeasure(
        allAttributes.get('border')
      );

      styleAttribute.set('border', attributeValue.value + 'pt solid black');

      allAttributes.delete('border');
    }
  }

  getValueAndItsUnitOfMeasure(style: string): StyleValue {
    let styleValue: StyleValue = null;
    var value: string, unit: string;
    var valueRegex = /([\d.]+)/;
    var valueMatch = valueRegex.exec(style);
    if (valueMatch) {
      value = valueMatch[1];
      unit = style.replace(value, '');
      styleValue = {
        value,
        unit,
      };
    }

    return styleValue;
  }

  resetAllElementAttributes(
    element: HTMLElement,
    newAttributes: Map<string, string>
  ) {
    let attributes = element.getAttributeNames();

    attributes.forEach(function (attribute) {
      if (newAttributes.has(attribute)) {
        element.setAttribute(attribute, newAttributes.get(attribute));
      } else {
        element.removeAttribute(attribute);
      }
    });
  }

  converStyleMapToStyleString(styleAttribute: Map<string, string>) {
    let stylesString: string = '';
    styleAttribute.forEach(function (value, key) {
      stylesString += key + ': ' + value + '; ';
    });
    return stylesString;
  }

  setTableWidth(
    tableStyle: Map<string, string>,
    widthType: string,
    value: string,
    unit: string
  ) {
    if (widthType == 'auto') {
      tableStyle.delete('width');
    } else {
      tableStyle.set('width', value + unit);
    }
    return tableStyle;
  }

  setTableBorder(tableStyle: Map<string, string>, borderSize: string) {
    if (parseFloat(borderSize) > 0) {
      tableStyle.set('border', borderSize + 'pt solid black');
    } else {
      tableStyle.set('border', borderSize + 'pt solid none');
    }

    return tableStyle;
  }

  getTableBorderFromStyleAttribute(tableStyle: Map<string, string>): string {
    var valueRegex = /([\d.]+)/;
    var borderStyle = tableStyle.get('border');
    var valueMatch = valueRegex.exec(borderStyle);
    var value: string = '0';
    if (valueMatch) {
      if (valueMatch[1]) {
        value = valueMatch[1];
      }
    }
    return value;
  }
}
