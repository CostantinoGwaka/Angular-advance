import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MonitorService } from '../../modules/nest-monitoring/monitor.service';

@Injectable()
export class GraphqlLoggerInterceptor implements HttpInterceptor {
  sessionAlertIsShown = false;

  constructor(
    private notificationService: NotificationService,
    private storageService: StorageService,
    private monitorService: MonitorService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is for the GraphQL API
    if (request.url.endsWith('/graphql')) {
      const startTime = Date.now(); // Capture start time

      return next.handle(request).pipe(
        tap({
          next: (event) => {
            const endTime = Date.now(); // Capture end time
            const elapsedTime = endTime - startTime; // Calculate elapsed time

            const eventString = JSON.stringify(event);
            if (request?.body?.operationName === 'saveErrorLog') {
              return;
            }
            if (
              (eventString.includes('Unexpected token') &&
                (eventString.includes('is not valid JSON') ||
                  eventString.includes('in JSON at'))) ||
              eventString.includes('Received status code 401')
            ) {
              if (!this.sessionAlertIsShown) {
                localStorage.removeItem('isLoggedin');
                var message =
                  'Please sign in again to continue using the application.';
                this.notificationService.showConfirmMessage({
                  title: 'Your session has expired',
                  message: message,
                  showIcon: true,
                  isWarning: true,
                  acceptButtonText: 'Sign In',
                  allowCancel: false,
                  onConfirm: () => {
                    location.replace('/login');
                    this.notificationService.warningSnackbar(
                      'You are being redirected to the login page'
                    );
                  },
                });
                this.sessionAlertIsShown = true;
              }
            } else {
              if (
                eventString.includes('"code": 9001') ||
                eventString.includes('"code": 9002') ||
                eventString.includes('"code": 9003') ||
                eventString.includes('"code": 9004') ||
                eventString.includes('"code": 9006') ||
                eventString.includes('"code": 9007') ||
                eventString.includes('"code": 9008') ||
                eventString.includes('"code": 9009') ||
                eventString.includes('"code": 9010') ||
                eventString.includes('"code": 9011') ||
                eventString.includes('"code": 9012') ||
                eventString.includes('"code": 9013') ||
                eventString.includes('"code": 9014') ||
                eventString.includes('"code": 9015') ||
                eventString.includes('"code": 9016') ||
                eventString.includes('"code": 9017') ||
                eventString.includes('"code": 9018') ||
                eventString.includes('"code": 9019') ||
                eventString.includes('"code": 9020') ||
                eventString.includes('"error"') ||
                eventString.includes('"errors"') ||
                eventString.includes('SQL') ||
                eventString.includes('sql') ||
                eventString.includes('DataException')
              ) {
                this.monitorService.logGraphqlErrorFromResponse(event, request);
              }
            }
          },
          error: (error) => {
            this.monitorService.logGraphqlError(error, request);
          },
          complete: () => {
            const endTime = Date.now();
            this.monitorService.logHighLatencyEndpoint(
              endTime - startTime,
              request
            );
          },
        })
      );
    }
    return next.handle(request);
  }

  private extractFields(query: string): string[] {
    const fieldRegex = /[\w]+(?=\s*[{(])/g;
    const fields = query.match(fieldRegex) || [];

    return fields;
  }
}
