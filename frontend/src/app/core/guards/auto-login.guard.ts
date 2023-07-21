import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginGuard implements CanActivate {
  constructor(private readonly storageService: StorageService, private readonly routerService: RouterService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user = await this.storageService.getUser();
    const jwt = await this.storageService.getJWT();
    if (user && jwt) {
      await this.routerService.goToPatients();
      return false;
    }
    return true;
  }
}
