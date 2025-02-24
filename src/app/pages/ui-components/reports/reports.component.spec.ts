import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportsService } from 'src/app/services/reports.service';
import { EquipmentService } from 'src/app/services/equipment.service';
import { EquipmentStubService } from 'src/app/services/equipment.stub.service';
import { AuthStubService } from 'src/app/services/auth.stub.service'; // Importa el stub
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { AppEquipmentStubComponent } from '../equipment/equipment.stub.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AuthService } from 'src/app/services/auth.service';
import { ReportsStubService } from 'src/app/services/reports.stub.service';

describe('ReportsComponent', () => {
    let component: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReportsComponent,
                HttpClientTestingModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                MatNativeDateModule,
                AppEquipmentStubComponent,
                MatInputModule,
                MatDatepickerModule,
            ],
            providers: [
                ReportsService,
                { provide: ReportsService, useClass: ReportsStubService },
                { provide: EquipmentService, useClass: EquipmentStubService },
                { provide: AuthService, useClass: AuthStubService }, // Usa el stub
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ReportsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});