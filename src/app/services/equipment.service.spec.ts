import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipmentService } from './equipment.service';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

describe('EquipmentService', () => {
    let service: EquipmentService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('AuthService', ['getHeaders']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                EquipmentService,
                { provide: AuthService, useValue: spy }
            ]
        });
        service = TestBed.inject(EquipmentService);
        httpMock = TestBed.inject(HttpTestingController);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add equipment', () => {
        const mockEquipment = { bienNacional: '12345', descripcion: 'Test Equipment' };
        const mockResponse = { message: 'Equipment added successfully' };
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.addEquipment(mockEquipment).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/add`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockEquipment);
        req.flush(mockResponse);
    });

    it('should handle error when adding equipment with duplicate bienNacional', () => {
        const mockEquipment = { bienNacional: '12345', descripcion: 'Test Equipment' };
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.addEquipment(mockEquipment).subscribe(
            () => fail('should have failed with duplicate bienNacional error'),
            (error) => {
                expect(error.message).toBe('El Bien Nacional ya está registrado');
            }
        );

        const req = httpMock.expectOne(`${service['apiUrl']}/add`);
        req.flush({ error: 'El Bien Nacional ya está registrado' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle generic error when adding equipment', () => {
        const mockEquipment = { bienNacional: '12345', descripcion: 'Test Equipment' };
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.addEquipment(mockEquipment).subscribe(
            () => fail('should have failed with generic error'),
            (error) => {
                expect(error.message).toBe('Ocurrió un error al agregar el equipo');
            }
        );

        const req = httpMock.expectOne(`${service['apiUrl']}/add`);
        req.flush('forced test error', { status: 500, statusText: 'Server Error' });
    });

    it('should get equipment by bienNacional', () => {
        const bienNacional = '12345';
        const mockResponse = { bienNacional: bienNacional, descripcion: 'Test Equipment' };
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getEquipmentByBienNacional(bienNacional).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/search?bienNacional=${bienNacional}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle error when equipment is not found', () => {
        const bienNacional = '12345';
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getEquipmentByBienNacional(bienNacional).subscribe(
            () => fail('should have failed with not found error'),
            (error) => {
                expect(error.message).toBe('Equipo no encontrado.');
            }
        );

        const req = httpMock.expectOne(`${service['apiUrl']}/search?bienNacional=${bienNacional}`);
        req.flush('Equipment not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error when server is unreachable', () => {
        const bienNacional = '12345';
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getEquipmentByBienNacional(bienNacional).subscribe(
            () => fail('should have failed with server unreachable error'),
            (error) => {
                expect(error.message).toBe('No se pudo conectar al servidor.');
            }
        );

        const req = httpMock.expectOne(`${service['apiUrl']}/search?bienNacional=${bienNacional}`);
        req.error(new ErrorEvent('Network error'));
    });

    it('should handle generic error when getting equipment', () => {
        const bienNacional = '12345';
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getEquipmentByBienNacional(bienNacional).subscribe(
            () => fail('should have failed with generic error'),
            (error) => {
                expect(error.message).toBe('Error al buscar el equipo.');
            }
        );

        const req = httpMock.expectOne(`${service['apiUrl']}/search?bienNacional=${bienNacional}`);
        req.flush('forced test error', { status: 500, statusText: 'Server Error' });
    });

    it('should update equipment status', () => {
        const id = 1;
        const changes = { estado: 'Reparado' };
        const mockResponse = { message: 'Status updated successfully' };
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1 }));

        service.updateEquipmentStatus(id, changes).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/${id}/status`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ ...changes, userId: 1 });
        req.flush(mockResponse);
    });
});