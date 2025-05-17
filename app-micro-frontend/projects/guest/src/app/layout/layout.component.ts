import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../shared/animations/router-animation';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';
import { StorageService } from '../../services/storage.service';
import { AddEditTenderItemComponent } from '../../modules/nest-app/app-tender-creation/components/tender-items-creations/add-edit-tender-item/add-edit-tender-item.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { YoutubeVideoViewComponent } from './youtube-video-view/youtube-video-view.component';
import { TranslationService } from '../../services/translation.service';
import { Meta, Title } from '@angular/platform-browser';
import { NestUtils } from 'src/app/shared/utils/nest.utils';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppAdvertisementAreaComponent } from "./app-advertisement-area/app-advertisement-area.component";

@Component({
  selector: 'guest-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterLink,
    MatMenuModule,
    NgClass,
    TranslatePipe,
    NgOptimizedImage,
    AppAdvertisementAreaComponent
  ],
})
export class LayoutComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  @Input() page_name = '';
  @Input() page_sub_title = '';
  @Input() bodyBackgroundImage = '';
  @Input() page_title = null;
  @Input() page_description = null;


  passwordResetDescriptions: string[] = [
    "PASSWORD_RESET_DESCRIPTION_ONE",
    "PASSWORD_RESET_DESCRIPTION_TWO",
    "PASSWORD_RESET_DESCRIPTION_THREE",
    "PASSWORD_RESET_DESCRIPTION_FOUR",
  ];
  passwordResetExamples: { description: string, example: any }[] = [
    {
      description: "PASSWORD_RESET_DESCRIPTION_FIVE",
      example: ",./$%^&?&#64;#;):~\"!*+",
    },
    {
      description: "PASSWORD_RESET_DESCRIPTION_SIX",
      example: "1234567, QWERTY e.tc.",
    },
  ];

  languages = [
    { id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
    { id: 'tz', name: 'Swahili', key: 'SWAHILI', code: 'sw' },
  ];
  defaultLanguage: string;
  currentFlag: string;
  currentLabel: string;

  constructor(
    private translateService: TranslationService,
    private storageService: StorageService,
    private titleService: Title,
    private dialog: MatDialog,
    private meta: Meta
  ) {
    /**
     * Language Translation  Codes
     */
    this.defaultLanguage = storageService.getItem('language');
    if (this.defaultLanguage) {
      translateService.setDefaultLanguage(this.defaultLanguage);
    } else {
      this.defaultLanguage = translateService.getDefaultLanguage();
    }
    this.currentFlag = this.languages.find(
      (lang: any) => lang.code == translateService.getDefaultLanguage()
    ).id;
    this.currentLabel = this.languages.find(
      (lang: any) => lang.code == translateService.getDefaultLanguage()
    ).key;
  }

  changeLanguage(language: string) {
    this.translateService.setDefaultLanguage(language);
    this.storageService.setItem('language', language);
    this.currentFlag = this.languages.find(
      (lang: any) => lang.code == language
    ).id;
    this.currentLabel = this.languages.find(
      (lang: any) => lang.code == language
    ).key;
  }

  ngOnInit(): void {
    this.setPageTitleAndDescription();
  }

  setPageTitleAndDescription() {
    let title = this.page_title ? this.page_title : this.page_name;
    this.titleService.setTitle(NestUtils.setPageTitle(title, this.meta));

    let description = this.page_description ? this.page_description : title;

    NestUtils.setPageDescription(this.meta, description);
  }

  ngOnChanges(changes: SimpleChange): void {
    if (changes['title'] || changes['description']) {
      this.setPageTitleAndDescription();
    }
  }

  setLoading() { }

  onYoutubeClick() {
    // const dialogRef = this.dialog.open(YoutubeVideoViewComponent, {
    //   width: '640',
    //   height: '450',
    //   minWidth : '640',
    //   minHeight : '450',
    //   disableClose:true,
    //   enterAnimationDuration:'500ms',
    //   exitAnimationDuration:'500ms',
    // });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '640';
    dialogConfig.height = '450';
    dialogConfig.minWidth = '640px';
    dialogConfig.minHeight = '450px';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(YoutubeVideoViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => { });
  }
}
