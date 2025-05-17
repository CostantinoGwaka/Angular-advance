import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private drawerState = new BehaviorSubject<boolean>(false);
  drawerState$ = this.drawerState.asObservable();

  toggleDrawer() {
    this.drawerState.next(!this.drawerState.getValue());
  }

  openDrawer() {
    this.drawerState.next(true);
  }

  closeDrawer() {
    this.drawerState.next(false);
  }
}
