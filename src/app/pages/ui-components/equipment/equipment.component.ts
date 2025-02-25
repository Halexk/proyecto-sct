
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EquipmentService } from 'src/app/services/equipment.service';
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [MatSnackBarModule, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class AppEquipmentComponent {
  equipmentForm = new FormGroup({
    bienNacional: new FormControl('', Validators.required),
    tipoEquipo: new FormControl('', Validators.required),
    numeroSerie: new FormControl(null, Validators.required),
    estado: new FormControl('', Validators.required),
    ubicacion: new FormControl('', Validators.required),
    asignacion: new FormControl('', Validators.required),
    caracteristicas: new FormControl('', Validators.required)
  });

  constructor(
    private equipmentService: EquipmentService,
    private snackBar: MatSnackBar 
  ) {}

  onSubmit() {
    if (this.equipmentForm.valid) {
      this.equipmentService.addEquipment(this.equipmentForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Equipo agregado exitosamente', 'Cerrar', { duration: 5000 });
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 5000 });
    }
  }
}
