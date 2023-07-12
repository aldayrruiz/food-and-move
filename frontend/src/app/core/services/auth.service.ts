import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWT } from '@core/models/auth/jwt.model';
import { StorageService } from '@core/services/storage.service';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeModel } from '../models/employee/employee.model';
import { EmployeesService } from './employees.service';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private routerService: RouterService,
    private employeesService: EmployeesService,
    private http: HttpClient
  ) {}

  signIn(email: string, password: string) {
    return this.http.post<JWT>(`${environment.api}/auth/employee/signIn`, { email, password });
  }

  async logout() {
    this.storageService.removeAll();
    await this.routerService.goToLogin();
  }

  refreshToken() {
    const refreshToken = this.storageService.getJWT().refreshToken;
    const headers = { Authorization: `Bearer ${refreshToken}` };
    return this.http.get<JWT>(`${environment.api}/auth/employee/refresh`, { headers });
  }

  getPayloadFromJwt(jwtToken: string) {
    const parts = jwtToken.split('.');
    const payload = window.atob(parts[1]);
    return JSON.parse(payload);
  }

  async storeImportantVariables(jwt: JWT) {
    // Store JWT
    this.storageService.storeJWT(jwt);

    // Get and store user
    const userId = this.getPayloadFromJwt(jwt.accessToken).sub;
    const user = await lastValueFrom(this.employeesService.getEmployee(userId));
    this.storageService.storeUser(user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.api}/auth/employee/forgotPassword/${email}`);
  }

  recoverPassword(token: string, password: string): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(`${environment.api}/auth/employee/recoverPassword`, {
      token,
      password,
    });
  }
}
