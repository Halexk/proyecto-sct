import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEquipmentComponent} from './equipment.component';

describe('ReportsComponent', () => {
  let component: AppEquipmentComponent;
  let fixture: ComponentFixture<AppEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
