import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';



const apiUrl = 'http://localhost:3000/api/equipments'; // Replace with your API base URL


@Injectable({
  providedIn: 'root'
})



export class EquipmentService {
  

  constructor(private http: HttpClient) {}

  addEquipment(equipment: any): Observable<any> {
    return this.http.post(`${apiUrl}/add`, equipment).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error.error === 'El Bien Nacional ya está registrado') {
          return throwError(() => new Error('El Bien Nacional ya está registrado'));
        }
        return throwError(() => new Error('Ocurrió un error al agregar el equipo'));
      })
    );
  }
  getEquipmentByBienNacional(bienNacional: string): Observable<any> {
    return this.http.get(`${apiUrl}/search?bienNacional=${bienNacional}`);
  }

  updateEquipmentStatus(id: number, changes: any): Observable<any> {
    return this.http.put(`${apiUrl}/${id}/status`, changes);
  }
}