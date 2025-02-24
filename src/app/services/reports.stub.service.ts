import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ReportsStubService {
    getReporteReparados(fechaInicio: string, fechaFin: string): Observable<any> {
        return of({});
    }

    getTiempoReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
        return of({});
    }

    getReporteReubicados(fechaInicio: string, fechaFin: string): Observable<any> {
        return of({});
    }

    getRetirosReparacion(fechaInicio: string, fechaFin: string): Observable<any> {
        return of({});
    }

    getReportesCompletos(fechaInicio: string, fechaFin: string): Observable<any> {
        return of({});
    }
}