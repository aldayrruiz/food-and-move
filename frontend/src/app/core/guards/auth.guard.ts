import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/api/auth.service';
import { StorageService } from '@core/services/storage.service';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private routerService: RouterService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const user = this.storageService.getUser();
    const jwt = this.storageService.getJWT();
    if (user && jwt) {
      return true;
    }
    await this.authService.logout();
    await this.routerService.goToLogin();
    return false;
  }
}
