import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importar AuthService
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/equipments`; // URL del backend

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inyectar AuthService
  ) { }

  addEquipment(equipment: any): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.post(`${this.apiUrl}/add`, equipment, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.error === 'El Bien Nacional ya está registrado') {
          return throwError(() => new Error('El Bien Nacional ya está registrado'));
        }
        return throwError(() => new Error('Ocurrió un error al agregar el equipo'));
      })
    );
  }

  // Método para buscar un equipo por Bien Nacional
  getEquipmentByBienNacional(bienNacional: string): Observable<any> {
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.get(`${this.apiUrl}/search?bienNacional=${bienNacional}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => new Error('Equipo no encontrado.'));
        } else if (error.status === 0) {
          return throwError(() => new Error('No se pudo conectar al servidor.'));
        } else {
          return throwError(() => new Error('Error al buscar el equipo.'));
        }
      })
    );
  }

  updateEquipmentStatus(id: number, changes: any): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('user')!).id; // Obtener el ID del usuario
    const body = { ...changes, userId }; // Incluir el ID del usuario en el cuerpo de la solicitud
    const headers = this.authService.getHeaders(); // Obtener los headers con el token
    return this.http.put(`${this.apiUrl}/${id}/status`, body, { headers });
  }
}


