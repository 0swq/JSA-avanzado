import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = this.normalizeRoles(route.data?.['roles']);

    if (!requiredRoles.length) {
      return true;
    }
    const userRole = this.getUserRole();
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }
    if (userRole === 'admin') {
      return true;
    }
    if (requiredRoles.includes(userRole)) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
  private getUserRole(): string | null {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const stored = JSON.parse(raw);
      return (
        stored?.data?.usuario?.rolId ??
        stored?.usuario?.rolId ??
        stored?.data?.usuario?.rol?.nombre ??
        stored?.rol?.nombre ??
        stored?.rolId ??
        null
      );
    } catch {
      return null;
    }
  }
  private normalizeRoles(roles: unknown): string[] {
    if (!roles) return [];
    if (typeof roles === 'string') return [roles];
    if (Array.isArray(roles)) return roles.filter((r): r is string => typeof r === 'string');
    return [];
  }
}
