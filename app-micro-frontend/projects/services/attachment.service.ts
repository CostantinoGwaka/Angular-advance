import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ViewAttachmentComponent } from '../shared/components/view-attachment/view-attachment.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from './notification.service';
import {
  IndexdbLocalStorageService,
  Tables,
} from './indexdb-local-storage.service';
import { CachedAttachmentModel } from '../store/cached-attachment/cached-attachment.model';
import { GraphqlService } from './graphql.service';
import { BASE64_INSTITUTION_LOGO_BULK } from '../modules/nest-pe-management/store/institution/institution.graphql';
import { SettingsService } from './settings.service';
import { map, tap } from 'rxjs/operators';
import {
  DigitalSignatureDialogData,
  DigitalSignatureDocumentData,
  DigitalSignatureInputComponent,
  DigitalSignatureSignResponse,
} from '../shared/components/attachment-viewer/digital-signature-input/digital-signature-input.component';
import {ApolloNamespace} from "../apollo.config";

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private apollo: GraphqlService,
    private settingService: SettingsService,
    private indexDbLocalStorageService: IndexdbLocalStorageService,
    private notificationService: NotificationService
  ) {}

  async getSignedAttachment(
    documentUuid: string,
    returnObject: boolean = false
  ): Promise<any> {
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
        [documentUuid]
      )
    );
    let document: string;
    try {
      if (returnObject) {
        document = data[0];
      } else {
        document = data[0].signedDocBase64Attachment??data[0].base64Attachment;
      }
    } catch (e) {}
    return document;
  }

  async getMultipleSignedAttachment(documentUuid: string) {
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
        [documentUuid]
      )
    );
    let document: string;
    try {
      document = data[0];
    } catch (e) {}
    return document;
  }

  async getAttachment(documentUuid: string, getSigned = false): Promise<string> {
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
        [documentUuid]
      )
    );
    let attachment: string;
    try {
      attachment = (getSigned)? data[0].signedDocBase64Attachment:data[0].base64Attachment;
    } catch (e) {}
    return attachment;
  }

  async getPEDetails(entityUuidList: string[]) {
    try {
      const response: any = await this.apollo.fetchData({
        query: BASE64_INSTITUTION_LOGO_BULK,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          uuids: entityUuidList,
        },
      });
      if (response.data.getProcuringEntitiesByUuidByBatch?.code === 9000) {
        return response.data.getProcuringEntitiesByUuidByBatch.dataList;
      } else {
        return [];
      }
    } catch (e) {
      console.error(e);
    }
  }

  async fetchPELogoBulk(uuidList: string[]) {
    try {
      /** Fetch PE Details by bulk using pe uuids */
      let peInfo: any[] = (await this.getPEDetails(uuidList)) || [];

      /** Filter uuids that do not exists in indexedDb */
      const uuids = peInfo.map((info) => info.uuid);
      const existingUuids = await this.indexDbLocalStorageService.getAllKeys(
        Tables.InstitutionLogo,
        uuids
      );
      peInfo = peInfo.filter((info) => !existingUuids.includes(info.uuid));

      /** Map and get only logoUuid */
      let peInfoLogoUuidList = peInfo.map((info) => info.logoUuid);
      if (peInfoLogoUuidList.length == 0) {
        return;
      }

      peInfoLogoUuidList = peInfoLogoUuidList.filter((uuid) => uuid !== null);
      /** Fetch attachment details from DSMS and add it to indexedDb*/
      let logoInBase64SList: CachedAttachmentModel[] = [];
      this.http
        .post<any>(
          environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
          peInfoLogoUuidList
        )
        .pipe(
          tap((response) => {
            // Handle the response here
            const data = response;
            if (data && data.length) {
              logoInBase64SList = data;

              /// consider last update in local storage
              /// check if logo exist in local storage
              logoInBase64SList.forEach((logoData) => {
                // check if logo exists
                const institutionDetail = peInfo.find(
                  (info) => info.logoUuid == logoData.uuid
                );

                // double check if PE logo does not exists
                this.indexDbLocalStorageService
                  .getByKey(Tables.InstitutionLogo, institutionDetail.uuid)
                  .then((checker) => {
                    // if Logo does not exist add it to indexed db
                    if (!checker) {
                      /// check in redux if exists if not dispatch
                      this.setPeLogInLocalStorage({
                        uuid: institutionDetail.uuid,
                        logoUuid: logoData.uuid,
                        title: logoData.title,
                        description: logoData.description,
                        base64Attachment:
                          'data:image/png;charset=utf-8;base64,' +
                          logoData.base64Attachment,
                        signedDocBase64Attachment:
                          'data:image/png;charset=utf-8;base64,' +
                          logoData.signedDocBase64Attachment,
                        fileExtension: logoData.fileExtension,
                        hasLogo: true
                      });
                    }
                  });
              });
            }
          })
        )
        .subscribe();
    } catch (e) {
      console.error(e);
    }
  }

  setPeLogInLocalStorage(peData: CachedPeLogoData) {
    this.indexDbLocalStorageService.put(
      Tables.InstitutionLogo,
      {
        id: peData.uuid,
        data: {
          ...peData,
          lastUpdate: this.settingService.formatDate(
            Date.now()
          ),
        },
      }
    ).then();
  }

  async getPELogo(logoUuid: string) {
    let logoB64String: string;
    const data = await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
        [logoUuid]
      )
    );
    try {
      logoB64String =
        'data:image/png;charset=utf-8;base64,' + data[0].base64Attachment;
    } catch (e) {}
    return logoB64String;
  }

  getPELogoObservable(logoUuid: string) {
    return this.http
      .post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
        logoUuid,
      ])
      .pipe(
        map((data) =>
          (data || []).length > 0
            ? 'data:image/png;charset=utf-8;base64,' + data[0].base64Attachment
            : null
        )
      );
  }

  async signDocument(
    keyPhrase: string,
    userUuid: string,
    contact: any,
    attachmentUuid: string,
    reason = 'Security',
    location = 'Tanzania'
  ) {
    return await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL + `/nest-dsms/api/signature/sign-doc`,
        {
          userId: userUuid,
          fileUid: attachmentUuid,
          reason: reason,
          location: location,
          contactinfo: contact,
          passphrase: keyPhrase,
        }
      )
    );
  }

  async addHtmlAttachment(
    base64HtmlDocument: string,
    userUuid: string,
    title: string,
    description: string,
    modelId: number,
    moduleUuid: string,
    module: string,
    subModule: string
  ) {
    const attachmentDto = {
      createdByUuid: userUuid,
      title: title,
      description: description,
      model: module,
      subModule: subModule,
      modelId: modelId,
      modelUuid: moduleUuid,
      base64Attachment: base64HtmlDocument,
    };

    return await firstValueFrom(
      this.http.post<any>(
        environment.AUTH_URL +
          `/nest-dsms/api/attachment/create/save/pdf/fromhtml`,
        attachmentDto
      )
    );
  }

  async addAttachment(
    attachmentB64: string,
    userUuid: string,
    title: string,
    description: string,
    modelId: number,
    moduleUuid: string,
    module: string,
    subModule: string
  ) {
    return await firstValueFrom(
      this.http.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment`, [
        {
          createdByUuid: userUuid,
          title: title,
          description: description,
          model: module,
          subModule: subModule,
          modelId: modelId,
          modelUuid: moduleUuid,
          base64Attachment: attachmentB64,
        },
      ])
    );
  }

  async viewFile(base64string: any, fileFormat: any, name?: string) {
    const dialogRef = this.dialog.open(ViewAttachmentComponent, {
      width: '80%',
      data: {
        file: base64string,
        format: fileFormat,
        isBlob: true,
        name,
      },
    });
    return dialogRef.afterClosed().toPromise();
  }

  openBase64PDFInNewTab(base64Data, documentName) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const newTab = window.open();
    newTab.document.write(
      '<html><head><title>' +
        documentName +
        '</title></head><body style="margin:0;padding:0;"><iframe src="' +
        url +
        '" width="100%" height="100%" style="border:none;"></iframe></body></html>'
    );
  }

  async fetchAttachment(
    attachmentUuid: string,
    fileType: string,
    name?: string,
    openTab = false
  ) {
    try {
      const rData: any[] = await firstValueFrom(
        this.http.post<any>(
          environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
          [attachmentUuid]
        )
      );
      if (rData?.length > 0) {
        if (openTab) {
          this.openBase64PDFInNewTab(
            rData[0]?.signedDocBase64Attachment
              ? rData[0]?.signedDocBase64Attachment
              : rData[0]?.base64Attachment,
            name
          );
        } else {
          this.viewFile(
            rData[0]?.signedDocBase64Attachment
              ? rData[0]?.signedDocBase64Attachment
              : rData[0]?.base64Attachment,
            fileType,
            name
          ).then();
        }
        if (fileType.toLowerCase() !== 'pdf') {
          this.notificationService.successSnackbar(
            "Kindly wait... you're attachment is being downloaded...",
            'Ok'
          );
        }
      } else {
        this.notificationService.errorMessage(
          "It seems there is no attachment you're looking for at the moment..."
        );
      }
    } catch (e) {
      this.notificationService.errorMessage(
        'Something went wrong! ' + e.message
      );
    }
  }
  async fetchSignedAttachment(attachmentUuid: string, openTab = false) {
    try {
      const rData: any[] = await firstValueFrom(
        this.http.post<any>(
          environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
          [attachmentUuid]
        )
      );
      if (rData?.length > 0) {
        if (openTab) {
          this.openBase64PDFInNewTab(
            rData[0]?.signedDocBase64Attachment,
            rData[0].title
          );
        } else {
          this.viewFile(
            rData[0]?.signedDocBase64Attachment,
            rData[0]?.fileExtension,
            rData[0].title
          ).then();
        }
        if (rData[0]?.fileExtension.toLowerCase() !== 'pdf') {
          this.notificationService.successSnackbar(
            "Kindly wait... you're attachment is being downloaded...",
            'Ok'
          );
        }
      } else {
        this.notificationService.errorMessage(
          "It seems there is no attachment you're looking for at the moment..."
        );
      }
    } catch (e) {
      this.notificationService.errorMessage(
        'Something went wrong! ' + e.message
      );
    }
  }

  downloadPDFFile(base64String: string, name: string = 'download') {
    const downloadLink = document.createElement('a');
    const fileName = name ? name + '.pdf' : 'download.pdf';
    downloadLink.href = `data:application/pdf;base64,${base64String}`;
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
  }

  async fetchAttachmentBase64(attachmentUuid: string): Promise<string> {
    let file: string = null;
    try {
      const rData: any[] = await firstValueFrom(
        this.http.post<any>(
          environment.AUTH_URL + `/nest-dsms/api/attachment/list/`,
          [attachmentUuid]
        )
      );
      if (rData?.length > 0) {
        file = rData[0]?.signedDocBase64Attachment
          ? rData[0]?.signedDocBase64Attachment
          : rData[0]?.base64Attachment;
      } else {
        this.notificationService.errorMessage(
          "It seems there is no attachment you're looking for at the moment..."
        );
      }
    } catch (e) {
      this.notificationService.errorMessage(
        'Something went wrong! ' + e.message
      );
    }
    return file;
  }

  async deleteAttachmentDocuments(attachmentUuidList: string[]) {
    try {
      const response = await firstValueFrom(
        this.http.delete<any>(
          environment.AUTH_URL + `/nest-dsms/api/attachment`,
          { body: attachmentUuidList }
        )
      );
      return response.message;
    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage(
        'Failed to Delete document ' + e.message
      );
      return null;
    }
  }

  print(params?: { sectionToPrintId?: string; filename?: string }) {
    const sectionId = params?.sectionToPrintId || 'sectionToPrint';
    const filename = params?.filename || 'NeST File.pdf'; // Default filename if not provided

    // Create an iframe to contain the content
    const iframe = document.createElement('iframe');
    iframe.innerText = filename;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const idoc = iframe.contentDocument;

    // Define the print page style
    const pageStyle = `
      @page {
        size: A4;
        margin: 1.5cm;
      }
      @media print {
        body {
          margin: 0;
        }
      }
    `;

    // Set the title of the printed document
    idoc.title = 'Printed Document';

    // Create a <style> element for page styles
    const styleElement = idoc.createElement('style');
    styleElement.appendChild(idoc.createTextNode(pageStyle));

    const styleSheetsArray = Array.from(document.styleSheets);

    // Copy existing styles from the main document
    for (const styleSheet of styleSheetsArray) {
      if (styleSheet.cssRules) {
        // Convert CSSRuleList to an array for iteration
        const cssRulesArray = Array.from(styleSheet.cssRules);
        for (const cssRule of cssRulesArray) {
          styleElement.appendChild(idoc.createTextNode(cssRule.cssText));
        }
      }
    }

    // Append additional styles to elements
    styleElement.appendChild(
      idoc.createTextNode(`
      body {
        color: #000 !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
      }
    `)
    );

    idoc.head.appendChild(styleElement);

    // Get the content to print
    const contentToPrint = document.getElementById(sectionId)?.innerHTML || '';

    // Set the content in the iframe
    idoc.body.innerHTML = contentToPrint;

    // Delay printing by a second to ensure content is loaded
    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 1000);
  }

  viewFileByUuidWithLoader(
    fileUuid: string,
    name: string = null,
    filelUuidFetcherFunction: Function = null
  ) {
    this.notificationService.showLoader({
      allowCancel: true,
      message: 'Fetching attachment...',
    });

    this.fetchAttachment(fileUuid, 'pdf', name).then(() => {
      this.notificationService.hideLoader();
    });
  }

  async viewFileByUuidWithLoaderAndFileUuidFetcher(
    fileUuidFetcherFunction: () => Promise<string>,
    name: string = null
  ) {
    this.notificationService.showLoader({
      allowCancel: true,
      message: 'Fetching attachment...',
    });

    let fileUuid = await fileUuidFetcherFunction();

    if (!fileUuid) {
      this.notificationService.hideLoader();
      return;
    }

    this.fetchAttachment(fileUuid, 'pdf', name).then(() => {
      this.notificationService.hideLoader();
    });
  }

  signAttachment(data: DigitalSignatureDialogData, onDialogClose?: Function) {
    const dialogRef = this.dialog.open(DigitalSignatureInputComponent, {
      width: data.showDocumentPreview ? '80%' : '400px',
      height: data.showDocumentPreview ? '80%' : 'auto',
      data,
    });

    dialogRef.afterClosed().subscribe((res: DigitalSignatureSignResponse) => {
      if (onDialogClose) {
        onDialogClose(res);
      }
    });
  }
}


export interface CachedPeLogoData
{
  uuid: string,
  logoUuid: string,
  title: string,
  description: string,
  base64Attachment: string,
  signedDocBase64Attachment: string,
  fileExtension: string,
  hasLogo: boolean,
}
