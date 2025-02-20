import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    MatCardModule
  ]
})
export class ReportsComponent {
  reportForm = new FormGroup({
    fechaInicio: new FormControl('', Validators.required),
    fechaFin: new FormControl('', Validators.required)
  });

  // Datos de los reportes
  reparadosData: any = null;
  tiempoReparacionData: any = null;
  reubicadosData: any = null;
  retirosReparacionData: any = null;

  // Columnas para las tablas
  displayedColumnsReparados: string[] = ['totalReparados'];
  displayedColumnsTiempoReparacion: string[] = ['tiempoPromedio'];
  displayedColumnsReubicados: string[] = ['totalReubicados', 'ubicacionMasComun'];
  displayedColumnsRetirosReparacion: string[] = ['ubicacion', 'totalRetiros'];

  constructor(
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {}

  // Función para formatear la fecha al formato YYYY-MM-DD HH:mm:ss
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  generarReporte() {
    if (this.reportForm.valid) {
      const fechaInicio = this.reportForm.get('fechaInicio')?.value;
      const fechaFin = this.reportForm.get('fechaFin')?.value;
  
      // Verificar que las fechas no sean null o undefined
      if (!fechaInicio || !fechaFin) {
        this.snackBar.open('Las fechas de inicio y fin son requeridas', 'Cerrar', { duration: 5000 });
        return;
      }
  
      // Formatear las fechas al formato YYYY-MM-DD HH:mm:ss
      const fechaInicioFormateada = this.formatDate(new Date(fechaInicio));
      const fechaFinFormateada = this.formatDate(new Date(fechaFin));
  
      // Obtener todos los reportes
      this.reportsService.getReporteReparados(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          this.reparadosData = [response];
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de reparados', 'Cerrar', { duration: 5000 });
        }
      });
  
      this.reportsService.getTiempoReparacion(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          this.tiempoReparacionData = [response];
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el tiempo de reparación', 'Cerrar', { duration: 5000 });
        }
      });
  
      this.reportsService.getReporteReubicados(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          this.reubicadosData = [response];
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de reubicados', 'Cerrar', { duration: 5000 });
        }
      });
  
      this.reportsService.getRetirosReparacion(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          this.retirosReparacionData = response;
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de retiros para reparación', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
  descargarPDF() {
    // Lógica para descargar el reporte en PDF
  }

  descargarExcel() {
    // Lógica para descargar el reporte en Excel
  }
}