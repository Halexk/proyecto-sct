import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from 'src/app/services/equipment.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-equipment-control',
  templateUrl: './equipment-control.component.html',
  styleUrls: ['./equipment-control.component.scss'],
  standalone: true, // Componente standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
  ]
})
export class EquipmentControlComponent {
  editForm = new FormGroup({
    bienNacional: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    ubicacion: new FormControl('', Validators.required),
    asignacion: new FormControl('', Validators.required),
    motivo: new FormControl('', Validators.required),
    observacion: new FormControl('', Validators.required)
  });

  equipment: any = null;

  constructor(
    private equipmentService: EquipmentService,
    private snackBar: MatSnackBar
  ) {
        // Escuchar cambios en el campo "motivo"
        this.editForm.get('motivo')?.valueChanges.subscribe((motivo) => {
          this.actualizarEstadoSegunMotivo(motivo);
        });
      }
    
      // Método para actualizar el estado según el motivo seleccionado
      actualizarEstadoSegunMotivo(motivo: string | null) {
        const estadoControl = this.editForm.get('estado');
        if (motivo === 'reparacion') {  
          estadoControl?.setValue('reparacion');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'entrega') {  
          estadoControl?.setValue('operativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'esperaEntrega') {  
          estadoControl?.setValue('operativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'esperaPieza') {  
          estadoControl?.setValue('inoperativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'esperaPieza') {  
          estadoControl?.setValue('inoperativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'reubicacion') {  
          estadoControl?.setValue('operativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'reasignacion') {  
          estadoControl?.setValue('operativo');
          estadoControl?.disable(); // Deshabilitar el control
        } else if (motivo === 'desincorporacion') {  
          estadoControl?.setValue('inoperativo');
          estadoControl?.disable(); // Deshabilitar el control
        } 
        
  }

  

  searchEquipment() {
    const bienNacional = this.editForm.get('bienNacional')?.value;
    if (!bienNacional) {
      this.snackBar.open('El campo Bien Nacional es requerido', 'Cerrar', { duration: 5000 });
      return;
    }
    this.equipmentService.getEquipmentByBienNacional(bienNacional).subscribe({
      next: (response) => {
        this.equipment = response;
        this.editForm.patchValue({
          estado: response.estado,
          ubicacion: response.ubicacion,
          asignacion: response.asignacion
        });
      },
      error: (error) => {
        this.snackBar.open('Equipo no encontrado', 'Cerrar', { duration: 5000 });
      }
    });
  }

  resetSearch() {
    this.equipment = null;
    this.editForm.reset();
  }

  onSubmit() {
    if (this.editForm.valid) {
      const changes = this.editForm.value;
      this.equipmentService.updateEquipmentStatus(this.equipment.id, changes).subscribe({
        next: (response) => {
          this.snackBar.open('Cambios guardados exitosamente', 'Cerrar', { duration: 5000 });
        },
        error: (error) => {
          this.snackBar.open('Error al guardar los cambios', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}