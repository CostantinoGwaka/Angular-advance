import { AuthService } from '../../../../services/auth.service';
import { selectModifiedAuthUsers } from '../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { ApplicationState } from 'src/app/store';
import { selectAllUsers } from '../../../../modules/nest-uaa/store/user-management/user/user.selectors';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { StorageService } from '../../../../services/storage.service';
import { select, Store } from '@ngrx/store';
import { TranslationService } from '../../../../services/translation.service';
import { environment } from 'src/environments/environment';
import { navBarMenu, NavBarMenu } from './nav-bar-menu';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ReplacePipe } from '../../../../shared/pipes/replace.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'web-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatButtonModule,
    AsyncPipe,
    ReplacePipe,
    TranslatePipe
],
})
export class NavBarComponent implements OnInit {
  languages = [
    { id: 'gb', name: 'English', key: 'ENGLISH', code: 'en' },
    { id: 'tz', name: 'Swahili', key: 'SWAHILI', code: 'sw' },
  ];
  defaultLanguage: string;
  users: User;
  currentFlag: string;
  currentLabel: string;
  isLoggedin: string = 'false';
  user$: Observable<AuthUser>;
  user: User;
  subjectMin: string;
  checkRole: boolean = false;
  showIcon: { [id: string]: boolean } = {};

  showSideMenu: boolean = false;

  navBarMenu: NavBarMenu[] = navBarMenu;
  hideUserDiv: boolean = true;

  constructor(
    private store: Store<ApplicationState>,
    private translateService: TranslationService,
    private authService: AuthService,
    private localStorage: StorageService,
    private renderer: Renderer2
  ) {
    this.defaultLanguage = localStorage.getItem('language');
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
    this.user$ = this.store.pipe(
      select(selectModifiedAuthUsers),
      map((users) => users[0])
    );
    this.checkIfLogin();
    this.scrollToTop();
    this.checkUser();
  }

  ngAfterViewInit() {
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  changeLanguage(language: string) {
    this.translateService.setDefaultLanguage(language);
    this.localStorage.setItem('language', language);
    this.currentFlag = this.languages.find(
      (lang: any) => lang.code == language
    ).id;
    this.currentLabel = this.languages.find(
      (lang: any) => lang.code == language
    ).key;
  }

  ngOnInit(): void {
    this.checkIfLogin();

    /**for icon on hover*/
    this.showIcon = {};
    this.navBarMenu.forEach((navBarMenuItem) => {
      if (navBarMenuItem.children && navBarMenuItem.children.length > 0) {
        navBarMenuItem.children.forEach((navBarMenuChildItem) => {
          if (navBarMenuChildItem.id) {
            this.showIcon[navBarMenuChildItem.id] = false;
          }
        });
      }

    });
  }

  getMenuRef(menuId: string): string {
    return `tendersMenu_${menuId}`;
  }

  toggleSideMenu() {
    this.showSideMenu = !this.showSideMenu;

    if (this.showSideMenu) {
      this.disablePageScroll();
    } else {
      this.enablePageScroll();
    }
  }

  checkIfLogin() {
    this.isLoggedin = this.localStorage.getItem('isLoggedin');
  }

  expandMenu(navBarMenu: NavBarMenu) {
    navBarMenu.isExpanded = !navBarMenu?.isExpanded;

  }

  logOut() {
    this.authService.logout().then();
  }

  disablePageScroll() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  preventSideMenuFromHiding(event: Event) {
    event.stopPropagation();
  }

  enablePageScroll() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  subStringSubjectT(title: string) {
    if (title.length > 15) {
      const subTitle = title.substring(0, 15);
      this.subjectMin = subTitle + '....';
    } else {
      this.subjectMin = title;
    }
    return this.subjectMin.toUpperCase();
  }

  myAccount() { }

  async checkUser() {
    this.users = await firstValueFrom(
      this.store.pipe(
        select(selectAllUsers),
        map((items) => items[0]),
        first((i) => !!i)
      )
    );
    this.users.rolesListStrings?.map((item) => {
      if (
        item === 'HEAD_OF_DEPARTMENT' ||
        item === 'ACCOUNTING_OFFICER' ||
        item === 'HEAD_OF_PMU'
      ) {
        this.checkRole = true;
      }
    });
    this.userDiv(this.users?.userTypeEnum);
  }

  userDiv(role: any) {
    if (role === "DIRECT_MANUFACTURER") {
      this.hideUserDiv = false;
    } else {
      this.hideUserDiv = true;
    }
  }

  subStringSubjectTitle(title: string) {
    if (title.length > 40) {
      const subTitle = title.substring(0, 40);
      this.subjectMin = subTitle + '....';
    } else {
      this.subjectMin = title;
    }
    return this.subjectMin.toUpperCase();
  }
}
