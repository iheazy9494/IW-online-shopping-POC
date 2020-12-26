import { charactersService } from './../pages/characters/characters.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: "root" })

export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            // auth so return true
            return true;
        }
        this.router.navigate(['/auth/login'])
        return false;
        //return true;
    }
}