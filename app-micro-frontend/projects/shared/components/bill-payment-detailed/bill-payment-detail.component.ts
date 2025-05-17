import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { GraphqlService } from "../../../services/graphql.service";
import {
  GET_BILLING_PAYMENT_BY_REFERENCE_NUMBER,
  UPDATE_BILLING_PAYMENT
} from "../../../modules/nest-billing/store/transcations/transcations.graphql";
import { BillPayment } from "../../../modules/nest-billing/store/bills-billing/allbills.model";
import { NotificationService } from "../../../services/notification.service";
import { HTMLDocumentService } from "../../../services/html-document.service";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "../../../services/settings.service";
import { select, Store } from "@ngrx/store";
import { ApplicationState } from "../../../store";
import {
  selectAllAuthUsers,
  selectModifiedAuthUsers
} from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { first, map } from "rxjs/operators";
import { AuthUser } from "../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { AttachmentService } from "../../../services/attachment.service";
import { DatePipe } from "@angular/common";
import { DoNotSanitizePipe } from '../../word-processor/pipes/do-not-sanitize.pipe';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-bill-payment-detail',
  templateUrl: './bill-payment-detail.component.html',
  styleUrls: ['./bill-payment-detail.component.scss'],
  standalone: true,
  imports: [LoaderComponent, MatButtonModule, DoNotSanitizePipe]
})
export class BillPaymentDetailComponent implements OnInit {
  @Input()
  selectedReference: string;
  @Output()
  closeForm: EventEmitter<any>;
  fetchingItem: boolean = true;
  payment: BillPayment;
  htmlDocument?: string;
  generateLoading: boolean = false;
  attachmentUuid: string;

  user: AuthUser;
  user$: Observable<AuthUser>;
  constructor(
    private apollo: GraphqlService,
    private notificationService: NotificationService,
    private htmlDocumentService: HTMLDocumentService,
    private settingService: SettingsService,
    private http: HttpClient,
    private attachmentService: AttachmentService,
    private store: Store<ApplicationState>,
  ) {
    this.user$ = this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]));
  }

  ngOnInit(): void {
    if (this.selectedReference) {
      this.initializer().then();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedReference']) {
      this.initializer().then()
    }
  }

  async initializer() {
    this.user = await firstValueFrom(this.store.pipe(select(selectAllAuthUsers), first(items => items.length > 0), map(i => i[0])));
    this.htmlDocument = null;
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_BILLING_PAYMENT_BY_REFERENCE_NUMBER,
        apolloNamespace: ApolloNamespace.billing,
        variables: {
          paymentRef: this.selectedReference,
        },
      });
      if (response.data.findBillingPaymentByPaymentRef?.code === 9000) {
        this.payment = response.data.findBillingPaymentByPaymentRef.data;
        this.attachmentUuid = this.payment.attachmentUuid;
        await this.createDocument(this.payment);
        this.fetchingItem = false;
      } else {
        throw new Error('Failed to fetch bill payments');
      }
    } catch (e) {
      this.notificationService.errorMessage('Problem occurred: ' + e.message);
      this.fetchingItem = false;
    }
  }


  async createDocument(payment: BillPayment) {
    const datePipe = new DatePipe('en-US')
    this.htmlDocument = await this.htmlDocumentService.createSimpleHTMLDocument({
      procuringEntityUuid: environment.PPRA_UUID,
      nonSTDTemplateCategoryCode: 'BILLING_RECEIPTS',
      specificTemplatePlaceholderValue:
        [
          { field: "payerName", value: this.payment.payerName },
          { field: "paidAmount", value: this.payment.paidAmount },
          { field: "currency", value: this.payment.currency },
          { field: "pspReceiptNumber", value: this.payment.pspReceiptNumber },
          { field: "payment", value: this.payment },
          { field: "payCtrNum", value: this.payment.payCtrNum },
          { field: "paymentReferenceId", value: this.payment.paymentReferenceId },
          { field: "transactionDateTime", value: datePipe.transform(this.payment.transactionDateTime, 'dd-MM-yyyy HH:mm:ss') },
        ]
    });

    // this.isPreview = false;
    this.fetchingItem = false;
  }

  async onViewPdf() {
    if (!this.attachmentUuid) {
      const base64data = this.htmlDocumentService.htmlToBase64(this.htmlDocument);

      await this.generateDocument(base64data);

      if (this.attachmentUuid) {
        // update attachment uuid;
        await this.updateBillPayment();
        await this.previewDocument(this.attachmentUuid);
      }
    } else {
      await this.previewDocument(this.attachmentUuid);
    }
  }


  async updateBillPayment() {
    try {
      this.generateLoading = true;
      const response: any = await this.apollo.mutate({
        mutation: UPDATE_BILLING_PAYMENT,
        apolloNamespace: ApolloNamespace.billing,
        variables: {
          documentUuid: this.attachmentUuid,
          paymentRef: this.payment.paymentReferenceId
        }
      });
      if (response.data.updateBillingPayment.code === 9000) {
        this.payment = response.data.updateBillingPayment.data;
        this.generateLoading = false;

      } else {
        console.error(response.data.updateBillingPayment?.message);
      }
    } catch (e) {
      this.generateLoading = false;
      this.notificationService.errorMessage(e.message);
    }
  }

  async generateDocument(base64data: string) {
    try {
      this.generateLoading = true;
      const attachData = await firstValueFrom(
        this.http.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment`, [
          {
            createdByUuid: this.user.uuid,
            title: 'UPLOADED BY ' + this.user.email,
            description: 'BILLING-RECEIPT' + this.user.email,
            model: 'BILLING-RECEIPT',
            subModule: 'BILLING-RECEIPT',
            modelId: 2,
            modelUuid: this.settingService.makeId(),
            base64Attachment: base64data,
          }
        ]
        )
      );

      this.generateLoading = false;
      if (attachData.message === 'ERROR') {
        // this.uploadedSampleMedia = null;
        this.notificationService.errorMessage('Failed to generate receipt. Please try again');
      } else {
        this.attachmentUuid = attachData.data[0].uuid;
      }

    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage('Failed to generate receipt. Please try again');
    }
  }

  async previewDocument(attachment) {
    this.generateLoading = true;
    if (attachment) {
      const data = await this.attachmentService.getSignedAttachment(attachment)
      await this.settingService.viewFile(data, 'pdf');
    }
    this.generateLoading = false;
  }

  print() {
    let element = document.getElementById("sectionToPrint");
    const iframe = document.body.appendChild(document.createElement("iframe"));
    iframe.style.display = "none";
    const idoc = iframe.contentDocument;

    // Create a new <style> element in the iframe's document
    const styleElement = idoc.createElement("style");
    Array.from(document.styleSheets).forEach((styleSheet) => {
      const cssRules = styleSheet.cssRules;
      if (cssRules) {
        for (let i = 0; i < cssRules.length; i++) {
          styleElement.appendChild(idoc.createTextNode(cssRules[i].cssText));
        }
      }
    });

    // Append additional styles to elements
    styleElement.appendChild(idoc.createTextNode(`
    body {
      color: #000 !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
    }
  `));

    idoc.head.appendChild(styleElement);
    idoc.body.innerHTML = element.innerHTML;
    window.setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 1000);
  }




}
