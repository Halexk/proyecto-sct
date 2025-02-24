import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportsService } from './reports.service';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

describe('ReportsService', () => {
    let service: ReportsService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('AuthService', ['getHeaders']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule], // Importa HttpClientTestingModule
            providers: [
                ReportsService,
                { provide: AuthService, useValue: spy } // Proporciona un mock de AuthService
            ]
        });
        service = TestBed.inject(ReportsService);
        httpMock = TestBed.inject(HttpTestingController);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    afterEach(() => {
        httpMock.verify(); // Verifica que no haya solicitudes HTTP pendientes
    });

    it('should be created', () => {
        expect(service).toBeTruthy(); // Verifica que el servicio se haya creado correctamente
    });

    it('should get reporte reparados', () => {
        const mockResponse = { totalReparados: 10 };
        const fechaInicio = '2023-01-01 00:00:00';
        const fechaFin = '2023-01-31 23:59:59';
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getReporteReparados(fechaInicio, fechaFin).subscribe(response => {
            expect(response).toEqual(mockResponse); // Verifica la respuesta
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/reparados?fechaInicio=2023-01-01%2000:00:00&fechaFin=2023-01-31%2023:59:59`);
        expect(req.request.method).toBe('GET'); // Verifica el método HTTP
        req.flush(mockResponse); // Simula la respuesta HTTP
    });

    it('should get tiempo reparacion', () => {
        const mockResponse = { tiempoPromedio: 5.5 };
        const fechaInicio = '2023-01-01 00:00:00';
        const fechaFin = '2023-01-31 23:59:59';
        authServiceSpy.getHeaders.and.returnValue(new HttpHeaders({ 'Authorization': 'Bearer testToken' }));

        service.getTiempoReparacion(fechaInicio, fechaFin).subscribe(response => {
            expect(response).toEqual(mockResponse); // Verifica la respuesta
        });

        const req = httpMock.expectOne(`${service['apiUrl']}/tiempo-reparacion?fechaInicio=2023-01-01%2000:00:00&fechaFin=2023-01-31%2023:59:59`);
        expect(req.request.method).toBe('GET'); // Verifica el método HTTP
        req.flush(mockResponse); // Simula la respuesta HTTP
    });
});