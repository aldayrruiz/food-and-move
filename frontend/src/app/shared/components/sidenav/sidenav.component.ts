import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeeModel } from '@core/models/employee/employee.model';
import { AuthService } from '@core/services/auth.service';
import { RouterService } from '@core/services/router.service';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  employee: EmployeeModel | null = null;

  constructor(
    private readonly routerService: RouterService,
    private readonly authService: AuthService,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.employee = this.storageService.getUser();
  }

  onSidenavClose() {
    this.sidenavClose.emit();
  }

  isAdmin(): boolean {
    return this.employee ? this.employee?.admin : false;
  }

  async logout() {
    await this.authService.logout();
    this.onSidenavClose();
  }

  goToPatients(): void {
    this.routerService.goToPatients();
    this.onSidenavClose();
  }

  goToEmployees(): void {
    this.routerService.goToEmployees();
    this.onSidenavClose();
  }

  goToRecipes(): void {
    this.routerService.goToRecipes();
    this.onSidenavClose();
  }

  goToDiets(): void {
    this.routerService.goToDiet();
    this.onSidenavClose();
  }

  goToRoutines(): void {
    this.routerService.goToRoutines();
    this.onSidenavClose();
  }

  goToConfiguration(): void {
    this.routerService.goToConfiguration();
    this.onSidenavClose();
  }
}
