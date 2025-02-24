import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class EquipmentStubService {
    addEquipment(equipment: any): Observable<any> {
        return of({});
    }

    getEquipmentByBienNacional(bienNacional: string): Observable<any> {
        return of({});
    }

    updateEquipmentStatus(id: number, changes: any): Observable<any> {
        return of({});
    }
}