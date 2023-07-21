import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWT } from '@core/models/auth/jwt.model';
import { StorageService } from '@core/services/storage.service';
import { catchError, from, lastValueFrom, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private storageService: StorageService, private authService: AuthService) {}

  // This function is used to intercept requests, and then add an authorization header to the request with the access token.
  // If the request returns a 401 response, then the refresh token is used to get a new access token, and the request is retried.
  // If the refresh token fails, the user is logged out.

  // @ts-ignore
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> | Observable<Observable<HttpEvent<any>> | Observable<never>> {
    const jwt = this.storageService.getJWT();

    if (jwt?.accessToken && !this.isRefreshing) {
      req = this.addAuthHeaders(req, jwt.accessToken);
    }

    return next.handle(req).pipe(
      // @ts-ignore
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/employee/signIn') &&
          error.status === 401
        ) {
          from(this.handle401Error(req, next));
        }
      })
    );
  }

  private async handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshing = true;

    const jwt = this.storageService.getJWT();
    if (jwt?.refreshToken) {
      return this.authService.refreshToken().pipe(
        switchMap(async (response: JWT) => {
          this.isRefreshing = false;
          await this.authService.storeImportantVariables(response);
          request = this.addAuthHeaders(request, response.accessToken);
          return lastValueFrom(next.handle(request));
        }),
        catchError(async (error) => {
          this.isRefreshing = false;

          if (error.status == '403') {
            await this.authService.logout();
          }

          return throwError(() => error);
        })
      );
    }

    return lastValueFrom(next.handle(request));
  }

  private addAuthHeaders(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
