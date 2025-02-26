import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service'; // Importar AuthService
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient,
    private authService: AuthService // Inyectar AuthService
  ) {}

  getReporteReparados(fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.get(`${this.apiUrl}/reparados`, {
      params: { fechaInicio, fechaFin }
    });
  }

  getTiempoReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.get<number>(`${this.apiUrl}/tiempo-reparacion`, {
      params: { fechaInicio, fechaFin },
    });
  }

  getReporteReubicados(fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.get(`${this.apiUrl}/reubicados`, {
      params: { fechaInicio, fechaFin },
      headers: headers,
    }).pipe(
      catchError((error) => {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud:', error);
        return of(null); // Devuelve null en caso de error
      }),
      map((response) => {
        // Verificar si la respuesta está vacía
        if (!response || Object.keys(response).length === 0) {
          return { mensaje: 'No se encontraron datos de reubicados' };
        }
        return response;
      })
    );
  }

  getRetirosReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.get(`${this.apiUrl}/retiros-reparacion`, {
      params: { fechaInicio, fechaFin },
      headers: headers,
    }).pipe(
      catchError((error) => {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud:', error);
        return of(null); // Devuelve null en caso de error
      }),
      map((response) => {
        // Verificar si la respuesta está vacía
        if (!response || Object.keys(response).length === 0) {
          return { mensaje: 'No se encontraron datos de retiros para reparación' };
        }
        return response;
      })
    );
  }
  getReportesCompletos(fechaInicio: string, fechaFin: string): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get(`${this.apiUrl}/reportes-completos`, {
      params: { fechaInicio, fechaFin },
      headers: headers,
    }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return of(null);
      }),
      map((response) => {
        if (!response || Object.keys(response).length === 0) {
          return { mensaje: 'No se encontraron reportes en el período especificado' };
        }
        return response;
      })
    );
  }
}