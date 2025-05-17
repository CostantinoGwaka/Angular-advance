import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../animations/router-animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../../store';
import { Go } from '../../../store/router/router.action';
import { MenuOption } from '../main-nav/menu-options';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { NgClass } from '@angular/common';
import { HasAccessFeatureDirective } from '../../directives/has-access-feature.directive';
import { HasPermissionAndFeatureDirective } from '../../directives/has-permission-and-feature.directive';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  standalone: true,
  imports: [HasPermissionAndFeatureDirective, NgClass, MatIconModule],
})
export class MenuItemsComponent implements OnInit {
  @Input() menus: MenuOption[] = [];
  @Output() menuClicked = new EventEmitter();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private store: Store<ApplicationState>
  ) { }

  ngOnInit(): void { }

  goTo(menu: MenuOption) {
    if (menu.route) {
      this.store.dispatch(new Go({ path: menu.pathRoute }));
    } else {
      this.menuClicked.emit(menu);
    }
  }

  getFeatureKeys(menu: any): string[] {
    if (!menu.feature) {
      return [];
    }

    return menu.feature?.length > 0 ? menu.feature.map((f: any) => f.key) : [];
  }
}
