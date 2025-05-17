import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationServicesService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  private urlsReadySubject = new BehaviorSubject<boolean>(false);
  urlsReady$ = this.urlsReadySubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;

        // Notify that URLs are ready
        this.urlsReadySubject.next(true);
      });
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}
