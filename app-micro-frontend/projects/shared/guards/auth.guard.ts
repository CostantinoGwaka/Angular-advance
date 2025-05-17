import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MenuOption, peMenuOptions } from '../components/main-nav/menu-options';
import { SettingsService } from '../../services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  currentMenuOptions: MenuOption[] = [];
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private storageService: StorageService,
    private authService: AuthService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.storageService.getItem('currentClient')) {
      this.router.navigate(['/login']).then();
      return false;
    }
    this.currentMenuOptions = [];
    const permissions = this.calculatePermissions(state.url);

    const route = this.checkPreviousRoute(permissions, state.url);
    if (route) {
      return false;
    } else if (this.authService.hasPermission(permissions)) {
      return true;
    } else {
      this.router.navigate(['/']).then();
      return false;
    }

  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.storageService.getItem('currentClient')) {
      this.router.navigate(['/login']).then();
      return false;
    }

    const urlMaxIndex = state?.url?.split('/').length;
    let option: { [key: string]: any } = {};
    for (let i = 2; i < urlMaxIndex; i++) {
      const opt = peMenuOptions.find(
        (option) => option.route[i] == state?.url?.split('/')[i]
      );
      if (opt) {
        option[i] = opt;
      }
    }

    // let permissions: any;
    let permissionsObj: { [k: number]: any[] } = {};
    const checkChild = (item: any, key: number, state: any) => {
      return item.children?.filter(
        (child) => child?.route[key + 1] == state?.url?.split('/')[key + 1]
      );
    }

    const processChild = (child: any[], startKey: number, state: any) => {
      child.forEach((c, index) => {
        let i = checkChild(c, startKey, state) || [];
        if (i.length == 1) {
          permissionsObj[startKey + index] = i[0]?.authority || [];
        } else {
          processChild(i, startKey + index, state);
        }
      });
    };

    Object.keys(option).forEach((key, pIndex) => {
      let child = checkChild(option[key], +key, state) || [];
      if (child.length == 1) {
        permissionsObj[+key] = child[0]?.authority || [];
      } else {
        processChild(child, +key, state);
      }
    });
    // const permissions = this.calculatePermissions(state.url);
    const permissions = Object.values(permissionsObj).flat();
    const route = this.checkPreviousRoute(permissions, state.url);
    if (route) {
      return false;
    } else if (this.authService.hasPermission(permissions)) {
      return true;
    } else {
      this.router.navigate(['/']).then();
      return false;
    }
  }


  private calculatePermissions(url: string): string[] {
    const routeParts = url.split('/').slice(2); // Extract route parts starting from the third element
    let permissions: string[] = [];
    routeParts
      .forEach(part => {
        permissions = [...permissions, ... this.findPermission(part)];
      })
    return permissions;
  }

  private findPermission(part: string): string[] {
    let authorities = [];

    peMenuOptions.forEach(option => {
      option.children?.filter(child => child.route[2] === part)?.forEach(
        child => {
          this.currentMenuOptions.push(child)
          authorities.push(child.authority);
        });
    });

    return authorities;
  }

  checkPreviousRoute(permissions: string[], currentUrl: string) {
    let previousRoute: string = this.storageService.getItem('previousRoute') || '';
    if (previousRoute.includes('landing')) {
      const perm = permissions.find(permission => this.authService.hasPermission(permission));
      if (perm) {
        const option = this.currentMenuOptions.find(option => option.authority == perm);
        const route = option.route;
        this.storageService.setItem('previousRoute', route.join(','))
        this.router.navigate(route).then();
        return route.join(',');
      }
    }

    this.storageService.setItem('previousRoute', currentUrl)
    return null;

  }

}
