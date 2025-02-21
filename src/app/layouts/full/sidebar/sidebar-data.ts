import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
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
