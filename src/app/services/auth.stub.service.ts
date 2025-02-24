import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthStubService {
    getHeaders(): HttpHeaders {
        return new HttpHeaders();
    }

    // Añade otros métodos necesarios de AuthService si son usados por ReportsService
    login(credentials: any): Observable<any> {
        return of({});
    }
    logout(): void {}
    register(user: any): Observable<any> {
        return of({});
    }
    isAuthenticated(): boolean {
        return true;
    }
}