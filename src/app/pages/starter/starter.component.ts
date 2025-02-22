import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppProfitExpensesComponent } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { AppProductSalesComponent } from 'src/app/components/product-sales/product-sales.component';
import { AppUpcomingSchedulesComponent } from 'src/app/components/upcoming-schedules/upcoming-schedules.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import { AppBlogComponent } from 'src/app/components/apps-blog/apps-blog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentService } from '../../services/equipment.service'; // Importar el servicio




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

  constructor(private equipmentService: EquipmentService) {} // Inyectar el servicio



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
  onKeyPress = (event:any) => {
    if (event.key === 'Enter') {
      this.buscarEquipo();
    }
  };
}

