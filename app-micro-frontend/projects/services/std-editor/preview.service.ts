import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import { Tender } from "../../modules/nest-app/store/tender/tender.model";

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
  placeHolders: any[];

  constructor() { }

  doTDS(text: string, tender: any) {
    let res = this.quickRepopulate(text, tender);
    return res;
  }

  doITTS(items: any[]) {
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

  quickRepopulate(text: string, tender: any) {
    let capturedPlaceHolders: string[] = [];

    for (let i = 0; i < this.placeHolders.length; i++) {
      if (text.includes(this.placeHolders[i].placeholder)) {
        capturedPlaceHolders.push('{' + this.placeHolders[i].placeholder + '}');
      }
    }

    if (capturedPlaceHolders) {
      let placeHolderValues = this.getPlaceholderValues(
        tender,
        this.placeHolders,
        capturedPlaceHolders
      );

      let results = this.substitutePlaceholdersValues(text, placeHolderValues);

      let html = this.convertTDSToTable(JSON.parse(results.preview));

      results.preview = html;

      return results;
    }
    return null;
  }

  convertTDSToTable(items: any[]) {
    let htmlTable = '';

    for (let i = 0; i < items.length; i++) {
      htmlTable += `<tr class="table-header"><td><strong>${i + 1
        }.</strong></td><td>${items[i].text}</td><td></td><td>${items[i].children[0].text
        }</td></tr>`;
    }

    return (
      '<table class="preview_table stripped"><tr><th >No.</th><th width=100>Required Information/Data</th><th>ITT Clause</th><th>Information/Data</th></tr>' +
      htmlTable +
      '</table>'
    );
  }

  do(templateToPreview: TemplateToPrevew | any): any {
    let capturedPlaceHolders = this.getDocumentPlaceholders(
      templateToPreview.template
    );

    if (capturedPlaceHolders) {
      let placeHolderValues = this.getPlaceholderValues(
        templateToPreview.tender,
        this.placeHolders,
        capturedPlaceHolders
      );

      let results = this.substitutePlaceholdersValues(
        templateToPreview.template,
        placeHolderValues
      );

      return results;
    }
    return null;
  }

  private getDocumentPlaceholders(text: string): string[] | null {
    let n = text.match(/\{(.*?)}/g);
    return n;
  }

  private getPlaceholderValues(
    tender: Tender,
    placeHolders: any[],
    capturedPlaceHolders: string[]
  ): any {
    let uniquePlaceHolders = [...new Set(capturedPlaceHolders)];

    let match: { [k: string]: any } = {};
    let missing = [];
    let unknown = [];

    let ob = JSON.parse(JSON.stringify(tender));

    for (let i = 0; i < uniquePlaceHolders.length; i++) {
      let sanitized = uniquePlaceHolders[i].slice(1, -1);

      let found = placeHolders.filter((ph) => ph.placeholder == sanitized);

      if (found.length > 0) {
        let ph = found[0];
        let val = null;

        if (ph.location.name == 'pe') {
          val = ob['pe'][ph.location.field];
        } else {
          val = ob[ph.location.field];
        }

        let key = `{${sanitized}}`;

        if (val) {
          match[key] = val;
        } else {
          missing.push(found[0]);
        }
      } else {
        unknown.push(sanitized);
      }
    }

    return { match, missing, unknown };
  }

  private substitutePlaceholdersValues(
    text: string,
    capturedValues: any
  ): PrevieDocument {
    capturedValues = this.putLogo(capturedValues);
    capturedValues = this.putCurrentDate(capturedValues);
    var re = new RegExp(Object.keys(capturedValues.match).join('|'), 'gi');

    text = text.replace(re, function (matched) {
      return capturedValues.match[matched];
    });

    return {
      preview: text,
      errors: {
        misses: capturedValues.missing,
        unknown: capturedValues.unknown,
      },
      status: 'success',
      message: '',
    };
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
