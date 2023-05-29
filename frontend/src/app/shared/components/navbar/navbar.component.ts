import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeModel } from '@core/models/employee.model';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@core/services/loader.service';
import { RouterService } from '@core/services/router.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isSmall = false;
  employee: EmployeeModel | null = null;

  showProfilePanel = false;

  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private readonly routerService: RouterService,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly authService: AuthService,
    public readonly loaderService: LoaderService,
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(
      (res) => {
        this.employee = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.breakpointObserver.observe(['(max-width: 959px)']).subscribe((result) => {
      this.isSmall = false;
      if (result.matches) {
        this.isSmall = true;
      }
    });
  }

  isActive(page: string) {
    return this.router.url.split('/')[1] == page;
  }

  isAdmin(): boolean {
    return this.employee ? this.employee.admin : false;
  }

  logout(): void {
    this.authService.logout();
  }

  goToPatients(): void {
    this.routerService.goToPatients();
  }

  goToEmployees(): void {
    this.routerService.goToEmployees();
  }

  goToRecipes(): void {
    this.routerService.goToRecipes();
  }

  goToDiets(): void {
    this.routerService.goToDiet();
  }

  goToRoutines(): void {
    this.routerService.goToRoutines();
  }

  goToConfiguration(): void {
    this.showProfilePanel = false;
    this.routerService.goToConfiguration();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
