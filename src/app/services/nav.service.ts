import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { NavItem } from '../layouts/full/sidebar/nav-item/nav-item';

@Injectable({ providedIn: 'root' })
export class NavService {
  public currentUrl = new BehaviorSubject<any>(undefined);
  private authenticatedNavItems: NavItem[] = [];
  private guestNavItems: NavItem[] = [];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
    this.initializeNavItems();
  }

  getNavItems(): NavItem[] {
    let items = this.authService.isLoggedIn()
      ? this.authenticatedNavItems
      : this.guestNavItems;

    // Filtrar elementos dependientes de la autenticación
    return items.filter(item => {
      if (item.navCap === 'Ui Components' || item.route === '/ui-components/equipmentRegister' || item.route === '/ui-components/control' || item.route === '/ui-components/reports') {
        return this.authService.isLoggedIn();
      }
      return true;
    });
  }

  private initializeNavItems() {
    this.authenticatedNavItems = [
      {
        navCap: 'Home',
      },
      {
        displayName: 'Dashboard',
        iconName: 'layout-dashboard',
        bgcolor: 'primary',
        route: '/dashboard',
      },
      {
        navCap: 'Ui Components',
      },
      {
        displayName: 'Registro',
        iconName: 'poker-chip',
        bgcolor: 'primary',
        route: '/ui-components/equipmentRegister',
      },
      {
        displayName: 'Control',
        iconName: 'poker-chip',
        bgcolor: 'primary',
        route: '/ui-components/control',
      },
      {
        displayName: 'Reportes',
        iconName: 'poker-chip',
        bgcolor: 'primary',
        route: '/ui-components/reports',
      },
      {
        navCap: 'Auth',
      },
      {
        displayName: 'Logout',
        iconName: 'lock',
        bgcolor: 'accent',
        route: '/authentication/logout',
      },
    ];

    this.guestNavItems = [
      {
        navCap: 'Home',
      },
      {
        displayName: 'Dashboard',
        iconName: 'layout-dashboard',
        bgcolor: 'primary',
        route: '/dashboard',
      },
      {
        navCap: 'Auth',
      },
      {
        displayName: 'Login',
        iconName: 'lock',
        bgcolor: 'accent',
        route: '/authentication/login',
      },
      {
        displayName: 'Register',
        iconName: 'user-plus',
        bgcolor: 'warning',
        route: '/authentication/register',
      },
    ];
  }
}