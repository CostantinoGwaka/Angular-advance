import { StorageService } from '../../../../services/storage.service';
import { AttachmentService } from '../../../../services/attachment.service';
import { PublicEntityItem } from './../../../store/public-tenders-item.model';
import { Component, OnInit, Input } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import * as moment from 'moment';
import { Router } from '@angular/router';
import {
  IndexdbLocalStorageService,
  Tables,
} from '../../../../services/indexdb-local-storage.service';
import { EntityObjectTypeEnum } from 'src/app/modules/nest-app/store/tender/tender.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';


@Component({
    selector: 'web-tender-item',
    templateUrl: './tender-item.component.html',
    styleUrls: ['./tender-item.component.scss'],
    standalone: true,
    imports: [TranslatePipe],
})
export class TenderItemComponent implements OnInit {
  @Input() requisitionItem: PublicEntityItem;
  constructor(
    private attachmentService: AttachmentService,
    private storageService: StorageService,
    private indexDbLocalStorageService: IndexdbLocalStorageService,
    private router: Router
  ) { }

  closingSoonDaysCount = 1;
  recursiveBreakerCount = 1;
  invitationDate: string;
  deadline: string;
  isClosingSoon: boolean = false;
  peLogo: string = null;
  loadLogo: boolean = false;

  ngOnInit(): void {
    this.init().then();
  }

  async init() {
    this.setDates();
    this.getPEDetails(this.requisitionItem.procuringEntityUuid);
  }

  getPEDetails(peUuid: string) {
    /** added this recursive function to help with checking if logo is found in indexedDb
     * added a 15 seconds check if logo does not exist to end this recursive */
    this.loadLogo = true;
    this.indexDbLocalStorageService
      .getByKey(Tables.InstitutionLogo, peUuid)
      .then((checker) => {
        if (checker) {
          this.loadLogo = false;
          this.peLogo = checker.data.base64Attachment;
        } else if (this.recursiveBreakerCount <= 6) {
          this.recursiveBreakerCount++;
          setTimeout(() => this.getPEDetails(peUuid), 2500);
        }
      });
  }

  async getPELogo(logoUuid: string) {
    this.loadLogo = true;
    const logo = await this.attachmentService.getPELogo(logoUuid);
    if (logo) {
      this.peLogo = logo;
    }
    this.loadLogo = false;
  }

  navigateViewDetails(requisitionItem) {
    /** check logged in user and verify user type */
    const isLoggedin = this.storageService.getItem('isLoggedin');
    const serviceUserType = this.storageService.getItem('serviceUserType');
    const hasSignature = this.storageService.getItem('hasSignature');
    if (
      isLoggedin == 'true' &&
      serviceUserType == 'TENDERER' &&
      hasSignature == 'true'
    ) {
      this.router.navigate([
        '/nest-tenderer/submission',
        requisitionItem.tender.uuid,
        requisitionItem.uuid,
      ]);
    } else {
      const tenderqueryParamString = JSON.stringify(
        requisitionItem.tender.uuid
      );
      const reqUuid = JSON.stringify(requisitionItem.uuid);
      this.router
        .navigate(['/tender-details'], {
          queryParams: {
            tender: tenderqueryParamString,
            reqUuid: reqUuid,
            entityType: this.getEntityType(requisitionItem),
          },
        })
        .then();
    }
  }

  getEntityType(requisiotnnItem: any): EntityObjectTypeEnum {
    try {
      switch (requisiotnnItem.__typename) {
        case 'MergedMainProcurementRequisition':
          return EntityObjectTypeEnum.TENDER;

        case 'PreQualification':
          return EntityObjectTypeEnum.PLANNED_TENDER;
        // case EntityObjectTypeEnum.FRAMEWORK:
        // case EntityObjectTypeEnum.CONTRACT:
        default:
          return EntityObjectTypeEnum.TENDER;
      }
    } catch (e) {
      return EntityObjectTypeEnum.TENDER;
    }
  }

  setDates() {
    this.setIsClosingSoon();
  }

  formatDate(date: string, withTime: boolean = false) {
    let formattedDate = moment(date).format('DD MMM YYYY');
    if (withTime) {
      formattedDate += ' ' + moment(date).format('h:mm A');
    }
    return formattedDate;
  }

  setIsClosingSoon() {
    let deadline = moment(this.requisitionItem?.submissionOrOpeningDate);
    let today = moment();

    let diff = deadline.diff(today, 'days');

    this.isClosingSoon = diff <= this.closingSoonDaysCount;
  }
}
