import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

const apiUrl = 'http://localhost:3000/api/users'; // URL del backend

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    cargo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(this.getAuthState()); // Inicializar con el estado persistido
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    const isAuth = this.getAuthState(); // Usar el estado persistido
    this.authState.next(isAuth);
    return isAuth;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${apiUrl}/register`, user)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          if (error.error && error.error.error === 'El DNI ya está registrado') {
            return throwError({ error: 'El DNI ya está registrado' });
          } else {
            return throwError(error);
          }
        })
      );
  }

  login(credentials: { dni: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.setAuthState(true); // Persistir el estado
          this.authState.next(true);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.logout();
      this.router.navigate(['/authentication/login']);
    }
    return throwError('Something bad happened; please try again later.');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setAuthState(false); // Persistir el estado
    this.authState.next(false);
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private setAuthState(state: boolean) {
    localStorage.setItem('authState', JSON.stringify(state));
  }

  private getAuthState(): boolean {
    const authState = localStorage.getItem('authState');
    return authState ? JSON.parse(authState) : false;
  }
}