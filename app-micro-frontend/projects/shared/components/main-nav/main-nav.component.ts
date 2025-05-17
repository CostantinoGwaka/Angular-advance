import { GraphqlService } from '../../../services/graphql.service';
import { GET_PROFILE_SETTING_BY_TENDERER_TYPE } from '../../../modules/nest-tenderer-management/store/countries-tax-authorities/countries-tax-authorities.graphql';
import { selectAllUsers } from 'src/app/modules/nest-uaa/store/user-management/user/user.selectors';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../store';
import { Go } from '../../../store/router/router.action';
import { firstValueFrom, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import {
  embassyMenuOptions,
  MenuOption,
  peMenuOptions,
  tenderMenuOptions,
  manufacturerMenuOptions,
} from './menu-options';
import {
  ActivatedRoute,
  Router,
  RouterLinkActive,
  RouterLink,
} from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { Report } from '../../../modules/nest-reports/store/reports/reports.model';
import * as reportSelector from '../../../modules/nest-reports/store/reports/reports.selectors';
import { HttpClient } from '@angular/common/http';
import {
  getAllTendererReports,
  setSelectedReport,
} from '../../../modules/nest-reports/store/reports/reports.actions';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CommonRealtimeClockComponent } from '../real-time/common-reatime-clock/common-realtime-clock.component';
import { ViewHelpComponent } from '../view-help/view-help.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatDividerModule } from '@angular/material/divider';
import { LoaderComponent } from '../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { AppBarComponent } from '../app-bar/app-bar.component';
import { SideBarService } from "../../../services/side-bar.service";
import { VoiceService } from '../../../services/voice-control.service';
import { way, greeting, commands } from './dataFileBots';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  standalone: true,
  imports: [
    AppBarComponent,
    MatSidenavModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    LoaderComponent,
    MatDividerModule,
    HasPermissionDirective,
    MatRippleModule,
    MatExpansionModule,
    ViewHelpComponent,
    CommonRealtimeClockComponent,
    AsyncPipe,
    TranslatePipe
  ],
})
export class MainNavComponent implements OnInit {
  @Input() isTenderer = false;
  @Input() dynamicClass = 'p-4 h-100 w-full';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  isOpen = true;
  menus = peMenuOptions;
  user: User;
  tenderMenuItems = tenderMenuOptions;
  embassyMenuItems = embassyMenuOptions;
  manufacturerMenuItems = manufacturerMenuOptions;
  loading: boolean = false;
  appImage: string = 'fransis.jpeg';
  menuItems: MenuOption[] = [];
  loaderTendererProfileMenus: boolean = false;
  currentMenu: any;
  helpOpened$: Observable<boolean>;
  reportsLoading$: Observable<boolean>;
  helpText$: Observable<string>;
  reports: Report[] = [];
  sectionsCodePush: {
    moduleDescription: string;
    module: string;
    authority: any;
    code: string;
    permission: any;
  }[] = [];
  isOpenBot = false;
  sectionsMenuToPush: MenuOption[] = [];
  fetchingReports = false;
  @ViewChild('navigationRef') navigationRef: ElementRef;
  activeRouteUrl: string;
  url: string;
  @Output() currentUrlEvent = new EventEmitter<string>();


  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<ApplicationState>,
    private route: ActivatedRoute,
    private router: Router,
    private client: HttpClient,
    private storageService: StorageService,
    private apollo: GraphqlService,
    private authService: AuthService,
    public voiceService: VoiceService,
    private sideNavService: SideBarService,
  ) {
    this.reportsLoading$ = this.store.pipe(
      select(reportSelector.selectReportLoading)
    );
  }

  ngOnInit() {
    this.sideNavService.openDrawer();
    this.sideNavService.drawerState$.subscribe((state: boolean) => this.isOpen = state);


    this.menus = this.filterMenusWithAccess(this.menus);

    // this.menus.filter((menu) => {
    //   console.log("menus :", this.menus);
    //   return this.authService.hasPermission(menu.authority) &&
    //     (!menu.feature || menu?.feature?.length === 0 || menu.feature.some(feature => this.authService.hasAccessFeatures(feature.key)))
    // }
    // );
    let menu: any;
    this.route.url.subscribe(async () => {
      const route = this.router.url.split('/');
      this.activeRouteUrl = this.router.url;
      this.currentUrl(this.activeRouteUrl);
      const moduleRoute = route[2];
      const subModuleRoute = route[3];
      const reportRoute = route[4];
      if (route.length < 5) {
        this.scrollToTop();
      }
      if (subModuleRoute) {
        this.currentMenu = subModuleRoute;
      }
      if (moduleRoute) {
        if (moduleRoute === 'reports') {
          this.loadData().then();
          this.store.dispatch(setSelectedReport({ id: reportRoute }));
          if (reportRoute) {
          }
        }
        menu = this.menus.find((i) => i.route.indexOf(moduleRoute) > -1);
        await this.setMenus(menu, moduleRoute === 'reports');
      }
    });



    // CHECK IF USER IS TENDERER / SUBSCRIBER AND RE ASSIGN MENUS
    const serviceUserType = this.storageService.getItem('serviceUserType');
    this.hideModuleMenu
      ? serviceUserType === 'SUBSCRIBER' || serviceUserType === 'TENDERER'
        ? this.setMenuTenderer(this.tenderMenuItems) //(this.menuItems = this.tenderMenuItems)
        : (this.menuItems = this.embassyMenuItems)
      : this.setMenus(menu, false);

    if (!this.hideModuleMenu) {
      if (serviceUserType === 'SUBSCRIBER' || serviceUserType === 'TENDERER') {
        this.setMenuTenderer(this.tenderMenuItems);
      }
      if (serviceUserType === 'SUBSCRIBER' || serviceUserType === 'EMBASSY') {
        this.menuItems = this.embassyMenuItems;
      }
    }
    if (serviceUserType === 'MANUFACTURER') {
      this.menuItems = this.manufacturerMenuItems;
    }

    if (!this.hideModuleMenu) {
      this.setMenus(menu, false);
    }
  }

  filterMenusWithAccess(menus: any[]): any[] {
    return menus
      .filter(menu => {
        const hasPermission = this.authService.hasPermission(menu.authority);

        // Skip menus with no features or an empty feature list
        const skipFeatureCheck = !menu.feature || menu.feature.length === 0;

        // Check if the menu has accessible features
        const hasFeatureAccess = menu.feature?.some(feature =>
          this.authService.hasAccessFeatures(feature.key)
        );

        // Recursively filter children
        const filteredChildren = menu.children
          ? this.filterMenusWithAccess(menu.children)
          : [];

        // Include menu if:
        // - It has permission, or
        // - It has accessible features, or
        // - It has accessible children
        return (
          hasPermission &&
          (skipFeatureCheck || menu.checkPermissionOnly ? true : hasFeatureAccess || filteredChildren.length > 0)
        );
      })
      .map(menu => {
        const filteredChildren = menu.children
          ? this.filterMenusWithAccess(menu.children)
          : [];

        // Return the menu, excluding 'children' if it's empty
        const { children, ...rest } = menu;
        return filteredChildren.length > 0
          ? { ...rest, children: filteredChildren }
          : rest;
      });
  }




  getRandomCommand(commands: string[]): string {
    const randomIndex = Math.floor(Math.random() * commands.length);
    return commands[randomIndex];
  }

  toggleOpen() {
    this.isOpenBot = true;
    this.speak();
  }

  toggleClose() {
    this.isOpenBot = false;
    this.voiceService.stopTalk();
  }


  currentUrl(value: string) {
    this.currentUrlEvent.emit(value);
  }

  scrollToTop() {
    this.navigationRef?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
    });
  }


  toggleListening() {
    if (this.voiceService.isListening) {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening();
    }
  }

  speak() {
    const randomCommand = this.getRandomCommand(commands);
    const greetingCommands = this.getRandomCommand(greeting);
    const wayCommands = this.getRandomCommand(way);

    this.voiceService.speak(greetingCommands);
    this.voiceService.speak(`${wayCommands} ${randomCommand}`);
  }

  handleToggle() {
    this.sideNavService.toggleDrawer();
  }
  async loadData() {
    this.store.dispatch(getAllTendererReports());
  }

  async onMenuClick(drawer: MatDrawer) {
    let isMobile = await firstValueFrom(this.isHandset$.pipe(first()));
    if (isMobile) {
      await drawer.toggle();
    }
  }

  get hideModuleMenu(): boolean {
    const serviceUserType = this.storageService.getItem('serviceUserType');
    return (
      serviceUserType === 'SUBSCRIBER' ||
      serviceUserType === 'TENDERER' ||
      serviceUserType === 'EMBASSY' ||
      serviceUserType === 'MANUFACTURER'
    );
  }

  logout() {
    this.store.dispatch(new Go({ path: ['login'] }));
  }

  async setMenuTenderer(menu: MenuOption[]) {
    this.loaderTendererProfileMenus = true;
    this.user = await firstValueFrom(
      this.store.pipe(
        select(selectAllUsers),
        first((items) => items.length > 0),
        map((i) => i[0])
      )
    );

    let section: any;
    let sectionsCode: {
      moduleDescription: string;
      module: string;
      authority: any;
      code: string;
      permission: any;
    }[] = [];
    this.sectionsCodePush = [];

    sectionsCode = [
      // {
      //   moduleDescription:
      //     'Bank Details',
      //   module: 'bank-details',
      //   authority: 'ROLE_SMENU_TNDRR_BANK_DETAILS',
      //   code: 'BANK_DETAILS',
      //   permission: [
      //     {
      //       key: 'ROLE_SMENU_TNDRR_BANK_DETAILS',
      //       action: 'View bank details',
      //     },
      //     {
      //       key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_CREATE',
      //       action: 'Create bank details',
      //     },
      //     {
      //       key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_EDIT',
      //       action: 'Edit bank details',
      //     },
      //     {
      //       key: 'ROLE_SMENU_TNDRR_BANK_DETAILS_DELETE',
      //       action: 'Delete bank details',
      //     },
      //   ],
      // },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_ANNUAL_TURNOVER_SIDE_NAV',
        module: 'average-turnover',
        authority: 'ROLE_SMENU_TNDRR_ANN_TOVR',
        code: 'ANNUAL_TURNOVER',
        permission: [
          { key: 'ROLE_SMENU_TNDRR_ANN_TOVR', action: 'View annual turnover' },
          {
            key: 'ROLE_SMENU_TNDRR_ANN_TOVR_CREATE',
            action: 'Create annual turnover',
          },
          {
            key: 'ROLE_SMENU_TNDRR_ANN_TOVR_EDIT',
            action: 'Edit annual turnover',
          },
          {
            key: 'ROLE_SMENU_TNDRR_ANN_TOVR_DELETE',
            action: 'Delete annual turnover',
          },
        ],
      },
      {
        moduleDescription:
          'TENDERER_QUALI_INFO_FINANCIAL_RESOURCES_SOURCES_FUNDS_SIDE_NAV',
        module: 'financial-resources',
        authority: 'ROLE_SMENU_TNDRR_SRC_FND',
        code: 'FINANCIAL_RESOURCES',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_SRC_FND',
            action: 'View financial resources',
          },
          {
            key: 'ROLE_SMENU_TNDRR_SRC_FND_CREATE',
            action: 'Create financial resources',
          },
          {
            key: 'ROLE_SMENU_TNDRR_SRC_FND_EDIT',
            action: 'Edit financial resources',
          },
          {
            key: 'ROLE_SMENU_TNDRR_SRC_FND_DELETE',
            action: 'Delete financial resources',
          },
        ],
      },

      {
        moduleDescription: 'TENDERER_QUALI_INFO_LITIGATION_RECORDS_SIDE_NAV',
        module: 'litigation-record',
        authority: 'ROLE_SMENU_TNDRR_LTG_HIS',
        code: 'LITIGATION_RECORDS',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_LTG_HIS',
            action: 'View litigation records',
          },
          {
            key: 'ROLE_SMENU_TNDRR_LTG_HIS_CREATE',
            action: 'Create litigation records',
          },
          {
            key: 'ROLE_SMENU_TNDRR_LTG_HIS_EDIT',
            action: 'Edit litigation records',
          },
          {
            key: 'ROLE_SMENU_TNDRR_LTG_HIS_DELETE',
            action: 'Delete litigation records',
          },
        ],
      },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_OFFICE_LOCATION_SIDE_NAV',
        module: 'office-location',
        authority: 'ROLE_SMENU_TNDRR_OFF_LCTN',
        code: 'OFFICE_LOCATIONS',
        permission: [
          { key: 'ROLE_SMENU_TNDRR_OFF_LCTN', action: 'View office locations' },
          {
            key: 'ROLE_SMENU_TNDRR_OFF_LCTN_EDIT',
            action: 'Edit office locations',
          },
          {
            key: 'ROLE_SMENU_TNDRR_OFF_LCTN_CREATE',
            action: 'Create office locations',
          },
          {
            key: 'ROLE_SMENU_TNDRR_OFF_LCTN_DELETE',
            action: 'Delete office locations',
          },
        ],
      },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_PERSONNEL_INFORMATION_SIDE_NAV',
        module: 'personnel-information',
        authority: 'ROLE_SMENU_TNDRR_PRSNL_INFO',
        code: 'PERSONNEL_INFORMATION',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_PRSNL_INFO',
            action: 'View personnel information',
          },
          {
            key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_CREATE',
            action: 'Create personnel information',
          },
          {
            key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_EDIT',
            action: 'Edit personnel information',
          },
          {
            key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_DELETE',
            action: 'Delete personnel information',
          },
          {
            key: 'ROLE_SMENU_TNDRR_PRSNL_INFO_MANAGE',
            action: 'Manage personnel information',
          },
        ],
      },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_WORK_EXPERIENCE_SIDE_NAV',
        module: 'tenderer-work-experiences',
        authority: 'ROLE_SMENU_TNDRR_WRK_EXPR',
        code: 'TENDERER_WORK_EXPERIENCE',
        permission: [
          { key: 'ROLE_SMENU_TNDRR_WRK_EXPR', action: 'View work experience' },
          {
            key: 'ROLE_SMENU_TNDRR_WRK_EXPR_CREATE',
            action: 'Create work experience',
          },
          {
            key: 'ROLE_SMENU_TNDRR_WRK_EXPR_EDIT',
            action: 'Edit work experience',
          },
          {
            key: 'ROLE_SMENU_TNDRR_WRK_EXPR_DELETE',
            action: 'Delete work experience',
          },
        ],
      },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_KEY_ACTIVITY_SIDE_NAV',
        module: 'tenderer-experience-key-activity',
        code: 'TENDERER_KEY_ACTIVITY',
        authority: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY',
            action: 'View key activities',
          },
          {
            key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_CREATE',
            action: 'Create key activities',
          },
          {
            key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_EDIT',
            action: 'Edit key activities',
          },
          {
            key: 'ROLE_SMENU_TNDRR_KEY_ACTIVITY_DELETE',
            action: 'Delete key activities',
          },
        ],
      },
      {
        moduleDescription: 'TENDERER_QUALI_INFO_WORK_EQUIPMENT_SIDE_NAV',
        module: 'equipments',
        code: 'WORK_EQUIPMENT',
        authority: 'ROLE_SMENU_TNDRR_WRK_EQP',
        permission: [
          { key: 'ROLE_SMENU_TNDRR_WRK_EQP', action: 'View work equipment' },
          {
            key: 'ROLE_SMENU_TNDRR_WRK_CREATE',
            action: 'Create work equipment',
          },
          { key: 'ROLE_SMENU_TNDRR_WRK_EDIT', action: 'Edit work equipment' },
          {
            key: 'ROLE_SMENU_TNDRR_WRK_DELETE',
            action: 'Delete work equipment',
          },
        ],
      },
      {
        moduleDescription:
          'TENDERER_QUALI_INFO_FINANCIAL_CAPABILITY_STATEMENT_SIDE_NAV',
        module: 'cash-flow',
        code: 'FINANCIAL_CAPABILITY',
        authority: 'ROLE_SMENU_TNDRR_FIN_STMNT',
        permission: [
          {
            key: 'ROLE_SMENU_TNDRR_FIN_STMNT',
            action: 'View financial statement',
          },
          {
            key: 'ROLE_SMENU_TNDRR_FIN_STMNT_CREATE',
            action: 'Create financial statement',
          },
          {
            key: 'ROLE_SMENU_TNDRR_FIN_STMNT_EDIT',
            action: 'Edit financial statement',
          },
          {
            key: 'ROLE_SMENU_TNDRR_FIN_STMNT_DELETE',
            action: 'Delete financial statement',
          },
        ],
      },
    ];
    try {
      const response: any = await this.apollo.fetchData({
        query: GET_PROFILE_SETTING_BY_TENDERER_TYPE,
        apolloNamespace: ApolloNamespace.uaa,
        variables: {
          tendererType: this.user.tenderer.tendererType,
        },
      });
      const values: any =
        response?.data?.allTendererProfileNavigationSettingsByTendererType;
      if (values) {
        section = values;
      }
    } catch (e) { }
    this.menuItems = menu;
    if (this.user.tenderer.tendererType == 'SPECIAL_GROUP') {
      // this.menuItems.map((item, index) => {
      //   if (item?.name == 'TENDERER_USERS_SIDE_NAVIGATION') {
      //     this.menuItems.splice(index, 1);
      //   }
      // });
      this.menuItems.map((item, index) => {
        if (item?.name == 'Group Members') {
          this.menuItems.splice(index, 1);
        }
      });
    } else if (
      this.user.tenderer.tendererType != 'SPECIAL_GROUP' &&
      this.user.tenderer.tendererType != 'GOVERNMENT_ENTERPRISE'
    ) {
      this.menuItems.map((item, index) => {
        if (item?.name == 'Group Members') {
          this.menuItems.splice(index, 1);
        }
      });
    }

    for (let i in this.menuItems) {
      if (
        this.menuItems[i].name ==
        'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION' &&
        section.length > 0
      ) {
        this.sectionsCodePush = [];
        section.map((item) => {
          sectionsCode.map((section) => {
            if (item.code == section.code) {
              this.sectionsCodePush.push(section);
            }
          });
        });
        this.menuItems[i].children = [];
        this.menuItems[i] = {
          name: 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION',
          route: ['', 'nest-tenderer', 'profile-information'],
          icon: 'settings',
          authority: 'ROLE_MENU_TNDRR_QLF_INFO',
          permission: [
            {
              key: 'ROLE_MENU_TNDRR_QLF_INFO',
              action: 'View Qualification information',
            },
          ],
          iconType: 'MATERIAL',
          key: 'settings',
          children: [
            ...this.menuItems[i].children,
            ...this.sectionsCodePush.map((i) => {
              return {
                name: i.moduleDescription,
                authority: i.authority,
                permission: i.permission,
                route: ['', 'nest-tenderer', 'profile-information', i.module],
              };
            }),
          ],
        };
      } else if (
        this.menuItems[i].name ==
        'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION' &&
        section.length == 0
      ) {
        this.menuItems.pop();
      }
      this.loaderTendererProfileMenus = false;
    }

    // this.menuItems.map(item => {
    //   if (
    //     item.name === 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION' &&
    //     section.length > 0
    //   ) {
    //
    //     // this.sectionsMenuToPush = [];
    //     let itemChildren: MenuOption[] = item.children;
    //     let allowedCodes: string[] = (section || []).map((item) => item.code);
    //     itemChildren = itemChildren.filter((menu) => {
    //       return allowedCodes.includes(menu.code);
    //     });
    //     return {
    //       ...item,
    //       children: itemChildren
    //     };
    //   } else if (
    //     item.name === 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION' &&
    //     section.length == 0
    //   ) {
    //     return {
    //       ...item,
    //       children: []
    //     };
    //   }
    //   else {
    //     return item;
    //   }
    // });
  }

  async setMenus(menu: any, isReport) {
    this.menuItems = menu?.children;
    if (!isReport) {
      this.fetchingReports = true;
      try {
        // let reports: Report[];
        // if (this.reports.length == 0) {
        //   reports = await lastValueFrom<Report[]>(
        //     this.client.get<Report[]>(
        //       environment.SERVER_URL + `/nest-report/report/list/`
        //     )
        //   );
        //   this.reports = reports;
        // } else {
        //   reports = this.reports;
        // }

        // const reportIds: { module: string; moduleDescription: string }[] = [];
        // reports.forEach((item) => {
        //   if (!reportIds.find((i) => i.module === item.module)) {
        //     reportIds.push({
        //       module: item.module,
        //       moduleDescription: item.moduleDescription,
        //     });
        //   }
        // });

        // this.menuItems = [
        //   ...menu.children,
        //   ...reportIds.map((i) => {
        //     return {
        //       name: i.moduleDescription,
        //       route: ['', 'modules', 'reports', 'reports-sections', i.module],
        //       icon: 'dashboard',
        //       iconType: 'MATERIAL',
        //     };
        //   }),
        // ];
        this.fetchingReports = false;
      } catch (e) {
        console.error(e);
        this.fetchingReports = false;
      }
    }
  }

  check($event: boolean) { }

  closeHelp() { }
}
