import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user'; // Import your user model

const apiUrl = 'http://127.0.0.1:5000'; // Replace with your API base URL

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isLoggedIn(): boolean {
    // // Verificar si hay un token válido almacenado (por ejemplo, en localStorage)
    // const token = this.getToken(); 
    // if (token) {
    //   // Puedes agregar lógica adicional para verificar la validez del token (por ejemplo, decodificarlo y verificar la fecha de expiración)
    //   return true; 
    // }
    // return false;
    return true
  }

  register(user: any): Observable<any> {
    return this.http.post(`${apiUrl}/register`, user) 
      .pipe(
        map(response => {
          return response; 
        }),
        catchError(error => {
          if (error.error && error.error.message === 'Duplicate ID or email') {
            return throwError({ error: 'Duplicate ID or email' }); 
          } else {
            return throwError(error); 
          }
        })
      );
  }

  login(credentials: { id: string; password: string }): Observable<any> {
    return this.http.post(`${apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
  }



  logout(): void {
    localStorage.removeItem('token');
  }


  // registerOrLogin(provider: string, providerId: string, email?: string, name?: string): Observable<any> {
  //   const params = { provider, provider_id: providerId };
  //   if (email) {
  //     params['email'] = email;
  //   }
  //   if (name) {
  //     params['name'] = name;
  //   }
  //   return this.http.get(`${apiUrl}/register_or_login`, { params })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}