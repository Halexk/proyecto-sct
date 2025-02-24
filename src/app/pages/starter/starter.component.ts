import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MaterialModule,
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {
  bienNacional: string = ''; // Campo para almacenar el Bien Nacional ingresado
  equipoEncontrado: any = null; // Objeto para almacenar el equipo encontrado
  error: string = ''; // Mensaje de error

  constructor(private equipmentService: EquipmentService) { }

  // Método para buscar el equipo
  buscarEquipo() {
    this.equipoEncontrado = null; // Reiniciar el equipo encontrado
    this.error = ''; // Reiniciar el mensaje de error

    if (!this.bienNacional) {
      this.error = 'Por favor, ingrese un Bien Nacional válido.';
      return;
    }

    // Usar el servicio para buscar el equipo
    this.equipmentService.getEquipmentByBienNacional(this.bienNacional).subscribe(
      (data: any) => {
        if (data) {
          this.equipoEncontrado = data; // Asignar el equipo encontrado
          console.log('Datos recibidos del backend:', data); // Verificar los datos
          console.log('Estado formateado:', this.formatearMotivo(data.estado)); // Verificar el formateo del estado
          console.log('Último motivo formateado:', this.formatearMotivo(data.ultimoMotivo)); // Verificar el formateo del último motivo
        } else {
          this.error = 'No se encontró ningún equipo con el Bien Nacional proporcionado.';
        }
      },
      (error) => {
        if (error.status === 404) {
          this.error = 'Equipo no encontrado.';
        } else if (error.status === 0) {
          this.error = 'No se pudo conectar al servidor. Por favor, intente nuevamente más tarde.';
        } else {
          this.error = 'Error al buscar el equipo. Por favor, intente nuevamente.';
        }
      }
    );
  }

  // Método para formatear el motivo
  formatearMotivo(motivo: string): string {
    switch (motivo) {
      case 'reubicacion':
        return 'Reubicación';
      case 'reparacion':
        return 'Reparación';
      case 'reasignacion':
        return 'Reasignación';
      case 'entrega':
        return 'Entrega';
      case 'esperaEntrega':
        return 'Espera por Entrega';
      case 'esperaPieza':
        return 'Espera por Pieza';
      case 'desincorporacion':
        return 'Desincorporación';
      case 'inoperativo':
        return 'Inoperativo';
      case 'operativo':
        return 'Operativo';
      default:
        return motivo; // Si no coincide con ningún caso, devolver el valor original
    }
  }

  onKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      this.buscarEquipo();
    }
  };
}