import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentControlComponent} from './equipment-control.component';

describe('ReportsComponent', () => {
  let component: EquipmentControlComponent;
  let fixture: ComponentFixture<EquipmentControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
