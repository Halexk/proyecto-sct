import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) {}

  getReporteReparados(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reparados`, {
      params: { fechaInicio, fechaFin }
    });
  }

  getTiempoReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tiempo-reparacion`, {
      params: { fechaInicio, fechaFin }
    });
  }

  getReporteReubicados(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reubicados`, {
      params: { fechaInicio, fechaFin }
    });
  }

  getRetirosReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/retiros-reparacion`, {
      params: { fechaInicio, fechaFin }
    });
  }
}