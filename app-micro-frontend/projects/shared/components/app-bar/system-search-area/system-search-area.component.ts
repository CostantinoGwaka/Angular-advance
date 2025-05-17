import { StorageService } from '../../../../services/storage.service';
import { AuthService } from '../../../../services/auth.service';
import {  Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MenuOption, peMenuOptions } from '../../main-nav/menu-options';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface SystemSearchResultsGroupItem {
  name: string;
}

interface RouteSearchResult {
  name: string;
  parents: string[];
  route: string[];
}

interface SystemSearchResultsGroup {
  groupName: string;
  groupid: string;
}
interface SystemSearchResults {
  group: SystemSearchResultsGroup;
  groupItems: SystemSearchResultsGroupItem[];
}

@Component({
    selector: 'system-search-area',
    templateUrl: './system-search-area.component.html',
    styleUrls: ['./system-search-area.component.scss'],
    standalone: true,
    imports: [
    MatIconModule,
    FormsModule,
    MatRippleModule,
    RouterLink
],
})


export class SystemSearchAreaComponent implements OnInit {
  keyword: string = '';
  isLoading: boolean = false;
  inSearchMode: boolean = false;
  results: SystemSearchResults[] = [];

  menuOptions: MenuOption[];
  menuOptionsResults: MenuOption[];
  routeSearchResults: RouteSearchResult[];

  debounceTimerId: any;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
  ) { }






  ngOnInit(): void {
    this.menuOptions = peMenuOptions;
    // const serviceUserType = this.storageService.getItem('serviceUserType');

    // switch (serviceUserType){
    //   case  'TENDERER':
    //     this.menuOptions = tenderMenuOptions;
    //   break;

    //   case  'PPRA':
    //     this.menuOptions = menuOptions;
    //   break;

    //   case  'SUBSCRIBER':
    //     this.menuOptions = menuOptions;
    //   break;

    //   case  'EMBASSY':
    //     this.menuOptions = embassyMenuOptions;
    //   break;
    // }

  }

  exitSearchMode() {
    this.inSearchMode = false;
    this.keyword = '';
  }

  search() {
    let timeout = 300;

    if (this.keyword == null || this.keyword == '') {
      this.inSearchMode = false;
    } else {
      this.inSearchMode = true;

      clearTimeout(this.debounceTimerId);
      this.debounceTimerId = setTimeout(() => {
        this.routeSearchResults = this.filterMenuOptions(
          this.menuOptions,
          this.keyword,
          []
        );
      }, timeout);
    }
  }

  filterMenuOptions(
    options: MenuOption[],
    keyword: string,
    parents: string[] = []
  ): RouteSearchResult[] {
    let filteredOptions = [];
    options.forEach((option) => {
      if (
        (option.name.toLowerCase().includes(keyword.toLowerCase()) ||
          option.route.some((r) => r.toLowerCase().includes(keyword.toLowerCase()))) &&
        this.authService.hasPermission(option.permission.map(p => p.key))
      ) {
        filteredOptions.push({
          name: option.name,
          parents: [...parents],
          route: option.route,
        });
      }
      if (option.children) {
        filteredOptions = [
          ...filteredOptions,
          ...this.filterMenuOptions(option.children, keyword, [
            ...parents,
            option.name,
          ]),
        ];
      }
    });
    return filteredOptions;
  }

  highlightKeyword(text: string, keyword: string): string {
    const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (keywordIndex === -1) {
      return text;
    } else {
      return (
        text.substring(0, keywordIndex) +
        '<b>' +
        text.substr(keywordIndex, keyword.length) +
        '</b>' +
        text.substring(keywordIndex + keyword.length)
      );
    }
  }
}
