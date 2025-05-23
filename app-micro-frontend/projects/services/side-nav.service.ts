// @ts-ignore
import {Injectable, ViewContainerRef} from "@angular/core";
// @ts-ignore
import {MatSidenav} from "@angular/material/sidenav";

@Injectable()
export class SideNavService {

  private sidenav: MatSidenav;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav.open();
  }


  public close() {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
