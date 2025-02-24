import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { EquipmentControlComponent } from './equipment-control.component';
import { EquipmentService } from '../../../services/equipment.service';

describe('EquipmentControlComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Agrega HttpClientTestingModule
        EquipmentControlComponent, // Agrega el componente standalone aquí
      ],
      providers: [EquipmentService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EquipmentControlComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});