import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequestModel } from '../models/auth-request.model';
import { AuthResponseModel } from '../models/auth-response.model';
import { EmployeeModel } from '../models/employee.model';
import { EmployeesService } from './employees.service';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userLogged = new BehaviorSubject<EmployeeModel | null>(null);
  public user$: Observable<EmployeeModel | null> = this.userLogged;

  constructor(
    private readonly http: HttpClient,
    private readonly routerService: RouterService,
    private readonly employeesService: EmployeesService
  ) {}

  getNewToken(user: AuthRequestModel): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${environment.api}/auth/loginEmployee`, user);
  }

  setSession(): void {
    const myUser = this.userLogged.getValue();
    if (!myUser && this.isLogin()) {
      this.employeesService.getEmployeeByEmail(this.email!).subscribe(
        (res) => {
          this.userLogged.next(res);
        },
        (err) => {
          console.log(err);
          this.logout();
        }
      );
    }
  }

  refreshUser(): void {
    this.employeesService.getEmployeeByEmail(this.email!).subscribe((res) => {
      this.employeesService.getEmployeeByEmail(this.email!).subscribe(
        (res) => {
          this.userLogged.next(res);
        },
        (err) => {
          console.log(err);
          this.logout();
        }
      );
    });
  }

  login(authResponse: AuthResponseModel): void {
    this.setToken(authResponse.token);
    this.setEmail(authResponse.user.email);
    this.routerService.goToPatients();
    this.setSession();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.routerService.goToLogin();
    this.userLogged.next(null);
  }

  isLogin(): boolean {
    if (this.token) return true;
    return false;
  }

  isAdmin(): boolean {
    const myUser = this.userLogged.getValue();
    return myUser ? myUser.admin : false;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  get email(): string | null {
    return localStorage.getItem('email');
  }

  setEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.api}/employees/forgotPassword/${email}`);
  }

  recoverPassword(token: string, password: string): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(`${environment.api}/employees/recoverPassword`, {
      token,
      password,
    });
  }
}
