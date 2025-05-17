import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../../apollo.config';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private auth: AuthService,
    private storageService: StorageService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentClient = this.storageService.getItem('currentClient');
    const curLang = this.storageService.getItem('language') || 'en';
    const userUuid = this.storageService.getItem('userUuid');
    const ipAddress = this.storageService.getItem('ipAddress');

    if (currentClient) {
      let headers = {
        Authorization: `Bearer ${currentClient}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Content-Language': curLang,
        boya: userUuid || '',
        'Double-Check': ipAddress || '',
      };

      request = request.clone({
        setHeaders: headers,
      });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const data = {
          reason: error && error.error?.reason ? error.error?.reason : '',
          status: error?.status,
          causedBy: error.error?.error_description,
        };
        this.auth.collectFailedRequest(data);
        return throwError(error);
      })
    );
  }
}
