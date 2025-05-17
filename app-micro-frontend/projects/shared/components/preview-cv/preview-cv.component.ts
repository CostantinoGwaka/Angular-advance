import {
  PersonnelInformation
} from './../../../modules/nest-tenderer/store/settings/personnel-information/personnel-information.model';
import {Store} from '@ngrx/store';
import {ApplicationState} from './../../../store/index';
import {
  FIND_TENDERER_CV_BY_UUID,
  GET_PERSONNEL_CV_BY_PERSONNEL_UUID
} from './../../../modules/nest-tenderer-management/store/tenderer/tenderer.graphql';
import {Tenderer} from './../../../modules/nest-tenderer-management/store/tenderer/tenderer.model';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {SettingsService} from '../../../services/settings.service';
import {HttpClient} from '@angular/common/http';
import {GraphqlService} from '../../../services/graphql.service';
import {NotificationService} from '../../../services/notification.service';
import {Component, Inject, OnInit} from '@angular/core';
import {ApolloNamespace} from 'src/app/apollo.config';
import {AttachmentService} from "../../../services/attachment.service";
import {GET_TENDERER_PERSONNEL_CV} from "../../../modules/nest-tenderer/store/submission/submission.graphql";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderComponent} from '../loader/loader.component';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-preview-cv',
  templateUrl: './preview-cv.component.html',
  styleUrls: ['./preview-cv.component.scss'],
  standalone: true,
  imports: [LoaderComponent, MatProgressSpinnerModule, LowerCasePipe]
})
export class PreviewCvComponent implements OnInit {

  fetchingItem: boolean = false;
  tenderer: Tenderer;
  fetchingAttachment: { [id: string]: boolean } = {};
  personnelInformation: PersonnelInformation;
  //change to model
  tendererCompetencyList: any[];
  tendererLanguageList: any[];
  userAcademicQualificationList: any[];
  userProfessionalQualificationList: any[];
  tendererTrainingList: any[];
  personnelWorkExperienceList: any[];
  tendererRefereeList: any[];
  allview: boolean;
  isSubmitted: boolean = false;
  userPersonnelCv: boolean = false;


  constructor(
    private store: Store<ApplicationState>,
    private notificationService: NotificationService,
    private attachmentService: AttachmentService,
    private apollo: GraphqlService,
    private http: HttpClient,
    private settingService: SettingsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) data,
  ) {
    this.tenderer = data.tenderer;
    this.userPersonnelCv = data.userPersonnelCv ?? false;
    this.isSubmitted = data.isSubmitted ?? false;
    this.allview = data.allview;
  }

  ngOnInit(): void {
    if (!this.userPersonnelCv) {
      this.fetchTendererCvDetails().then();
    } else {
      this.fetchPersonnelCvDetails().then();
    }
  }

  async fetchTendererCvDetails() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        apolloNamespace: ApolloNamespace.uaa,
        query: FIND_TENDERER_CV_BY_UUID,
        variables: {
          tendererUuid: this.tenderer.uuid,
        }
      });
      this.personnelInformation = response.data.getPersonnelCVByTendererUuid?.data?.personnelInformation;
      this.tendererCompetencyList = response.data.getPersonnelCVByTendererUuid?.data?.tendererCompetencyList;
      this.tendererLanguageList = response.data.getPersonnelCVByTendererUuid?.data?.tendererLanguageList;
      this.userAcademicQualificationList = response.data.getPersonnelCVByTendererUuid?.data?.userAcademicQualificationList;
      this.userProfessionalQualificationList = response.data.getPersonnelCVByTendererUuid?.data?.userProfessionalQualificationList;
      this.tendererTrainingList = response.data.getPersonnelCVByTendererUuid?.data?.tendererTrainingList;
      this.personnelWorkExperienceList = response.data.getPersonnelCVByTendererUuid?.data?.personnelWorkExperienceList;
      this.tendererRefereeList = response.data.getPersonnelCVByTendererUuid?.data?.tendererRefereeList;
      this.fetchingItem = false;
    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage('Failed to fetch details');
      this.fetchingItem = false;
    }
  }

  async fetchPersonnelCvDetails() {
    this.fetchingItem = true;
    try {
      const response: any = await this.apollo.fetchData({
        query: (this.isSubmitted) ? GET_TENDERER_PERSONNEL_CV : GET_PERSONNEL_CV_BY_PERSONNEL_UUID,
        apolloNamespace: (this.isSubmitted) ? ApolloNamespace.submission : ApolloNamespace.uaa,
        variables: {
          personnelUuid: this.tenderer.uuid,
        }
      });
      let result;
      if (this.isSubmitted) {
        result = response.data.getTendererPersonnelCV?.data;
      } else {
        result = response.data.getTendererPersonnelDataByPersonnelUuid?.data;
      }

      this.personnelInformation = result?.personnelInformation;
      this.tendererCompetencyList = result?.tendererCompetencyList;
      this.tendererLanguageList = result?.tendererLanguageList;
      this.userAcademicQualificationList = result?.userAcademicQualificationList;
      this.userProfessionalQualificationList = result?.userProfessionalQualificationList;
      this.tendererTrainingList = result?.tendererTrainingList;
      this.personnelWorkExperienceList = result?.personnelWorkExperienceList;
      this.tendererRefereeList = result?.tendererRefereeList;
      this.fetchingItem = false;

      if (this.isSubmitted) {
        this.tendererLanguageList = result?.tendererLanguageList.map(language => {
          return {
            language: {
              name: language.languageName
            },
            speak: language.speak,
            read: language.read,
            write: language.write
          }
        });

        this.userAcademicQualificationList = result?.userAcademicQualificationList.map(academic => {
          return {
            academicLevel: {
              levelName: academic.academicLevelName
            },
            offeringInstitute: academic.offeringInstitute,
            qualificationName: academic.qualificationName,
            fromDate: academic.fromDate,
            toDate: academic.toDate,
            attachmentUuid: academic.attachmentUuid
          }
        });
      }
    } catch (e) {
      console.error(e);
      this.notificationService.errorMessage('Failed to fetch details');
      this.fetchingItem = false;
    }
  }



  async viewCertificate(uuid: string) {
    this.fetchingAttachment[uuid] = true;

    let data = await this.attachmentService.getAttachment(uuid)
    this.settingService.viewFile(data, 'pdf').then(() => {
      this.fetchingAttachment[uuid] = false;
    });
    //
    // const data = await firstValueFrom(this.http.post<any>(environment.AUTH_URL + `/nest-dsms/api/attachment/list/`, [
    //  uuid
    // ]));
    //  await this.settingService.viewFile(data[0].base64Attachment, 'pdf');
  }
}
