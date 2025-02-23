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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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


  // Propiedad para almacenar los reportes completos
  reportesCompletos: any[] = [];


  constructor(
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) { }

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

      if (!fechaInicio || !fechaFin) {
        this.snackBar.open('Las fechas de inicio y fin son requeridas', 'Cerrar', { duration: 5000 });
        return;
      }

      const fechaInicioFormateada = this.formatDate(new Date(fechaInicio));
      const fechaFinFormateada = this.formatDate(new Date(fechaFin));


      // Obtener los reportes completos
      this.obtenerReportesCompletos(fechaInicioFormateada, fechaFinFormateada);

      // Obtener el reporte de equipos reparados
      this.reportsService.getReporteReparados(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          if (response.mensaje === 'No se encontraron datos de equipos reparados') {
            this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
            this.reparadosData = [];

          } else {
            this.reparadosData = [response];
          }
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de reparados', 'Cerrar', { duration: 5000 });
          this.reparadosData = [];
        },
      });

      // Obtener el tiempo promedio de reparación
      this.reportsService.getTiempoReparacion(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          if (response.mensaje === 'No se encontraron datos de tiempo de reparación') {
            this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
            this.tiempoReparacionData = [];
          } else {
            this.tiempoReparacionData = [response];
          }
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el tiempo de reparación', 'Cerrar', { duration: 5000 });
          this.tiempoReparacionData = [];
        },
      });

      // Obtener el reporte de reubicados
      this.reportsService.getReporteReubicados(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          if (response.mensaje === 'No se encontraron datos de reubicados') {
            this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
            this.reubicadosData = []; // Asignar un array vacío
          } else {
            this.reubicadosData = response; // Asignar directamente la respuesta
          }
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de reubicados', 'Cerrar', { duration: 5000 });
          this.reubicadosData = []; // Asignar un array vacío en caso de error
        },
      });

      // Obtener el reporte de retiros para reparación
      this.reportsService.getRetirosReparacion(fechaInicioFormateada, fechaFinFormateada).subscribe({
        next: (response) => {
          if (response.mensaje === 'No se encontraron datos de retiros para reparación') {
            this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
            this.retirosReparacionData = []; // Asignar un array vacío
          } else {
            this.retirosReparacionData = response; // Asignar directamente la respuesta
          }
        },
        error: (error) => {
          this.snackBar.open('Error al obtener el reporte de retiros para reparación', 'Cerrar', { duration: 5000 });
          this.retirosReparacionData = []; // Asignar un array vacío en caso de error
        },
      });
    }
  }

  async descargarPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
  
    // Título del reporte
    doc.setFontSize(18);
    doc.text('Reporte Completo', 10, 10);
  
    // Declarar la variable y
    let y = 20;
  
    // Función para verificar si se necesita una nueva página
    const checkPageBreak = (increment: number) => {
      if (y + increment > 280) { // Si el contenido supera el límite de la página
        doc.addPage(); // Agrega una nueva página
        y = 20; // Reinicia la posición vertical
      }
    };
  
    // Agregar los reportes completos
    if (this.reportesCompletos.length > 0) {
      doc.setFontSize(12);
      this.reportesCompletos.forEach((reporte, index) => {
        // Verificar si se necesita una nueva página antes de agregar el reporte
        checkPageBreak(100); // Ajusta el valor según el espacio que ocupa cada reporte
  
        doc.text(`Reporte ${index + 1}:`, 10, y);
        y += 10;
        doc.text(`- Bien Nacional: ${reporte.bienNacional}`, 15, y);
        y += 10;
        doc.text(`- Estado Anterior: ${reporte.estado_anterior}`, 15, y);
        y += 10;
        doc.text(`- Estado Nuevo: ${reporte.estado_nuevo}`, 15, y);
        y += 10;
        doc.text(`- Ubicación Anterior: ${reporte.ubicacion_anterior}`, 15, y);
        y += 10;
        doc.text(`- Ubicación Nueva: ${reporte.ubicacion_nueva}`, 15, y);
        y += 10;
        doc.text(`- Motivo: ${reporte.motivo}`, 15, y);
        y += 10;
        doc.text(`- Observación: ${reporte.observacion}`, 15, y);
        y += 10;
        doc.text(`- Fecha: ${new Date(reporte.created_at).toLocaleString()}`, 15, y);
        y += 15; // Espacio entre reportes
      });
    }
  
    // Agregar los datos de resumen (reparados, tiempoReparacion, etc.)
    if (this.reparadosData && this.reparadosData.length > 0) {
      checkPageBreak(20); // Verificar si se necesita una nueva página antes de agregar el resumen
      doc.text('Resumen de Equipos Reparados:', 10, y);
      y += 10;
      doc.text(`- Total Reparados: ${this.reparadosData[0].totalReparados}`, 15, y);
      y += 15;
    }
  
    if (this.tiempoReparacionData && this.tiempoReparacionData.length > 0) {
      checkPageBreak(20); // Verificar si se necesita una nueva página antes de agregar el resumen
      doc.text('Resumen de Tiempo Promedio de Reparación:', 10, y);
      y += 10;
      doc.text(`- Tiempo Promedio: ${this.tiempoReparacionData[0].tiempoPromedio} horas`, 15, y);
      y += 15;
    }
  
    // Guardar el PDF
    doc.save('reporte-completo.pdf');
  }

  descargarExcel() {
    const wsData: any[] = [];
  
    // Agregar encabezados para los reportes completos
    wsData.push(['Reportes Completos']);
    wsData.push([
      'Bien Nacional',
      'Estado Anterior',
      'Estado Nuevo',
      'Ubicación Anterior',
      'Ubicación Nueva',
      'Motivo',
      'Observación',
      'Fecha'
    ]);
  
    // Agregar los datos de los reportes completos
    if (this.reportesCompletos.length > 0) {
      this.reportesCompletos.forEach((reporte) => {
        wsData.push([
          reporte.bienNacional,
          reporte.estado_anterior,
          reporte.estado_nuevo,
          reporte.ubicacion_anterior,
          reporte.ubicacion_nueva,
          reporte.motivo,
          reporte.observacion,
          new Date(reporte.created_at).toLocaleString()
        ]);
      });
    }
  
    // Espacio en blanco entre secciones
    wsData.push([]);
  
    // Agregar los datos de resumen (reparados, tiempoReparacion, etc.)
    if (this.reparadosData && this.reparadosData.length > 0) {
      wsData.push(['Resumen de Equipos Reparados']);
      wsData.push(['Total Reparados']);
      wsData.push([this.reparadosData[0].totalReparados]);
      wsData.push([]); // Espacio en blanco
    }
  
    if (this.tiempoReparacionData && this.tiempoReparacionData.length > 0) {
      wsData.push(['Resumen de Tiempo Promedio de Reparación']);
      wsData.push(['Tiempo Promedio (horas)']);
      wsData.push([this.tiempoReparacionData[0].tiempoPromedio]);
      wsData.push([]); // Espacio en blanco
    }
  
    // Crear la hoja de trabajo
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
  
    // Crear el libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  
    // Escribir el archivo y descargarlo
    XLSX.writeFile(wb, 'reporte-completo.xlsx');
  }

  // Método para obtener los reportes completos
  obtenerReportesCompletos(fechaInicio: string, fechaFin: string) {
    this.reportsService.getReportesCompletos(fechaInicio, fechaFin).subscribe({
      next: (response) => {
        if (response.mensaje) {
          this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
          this.reportesCompletos = [];
        } else {
          this.reportesCompletos = response;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al obtener los reportes completos', 'Cerrar', { duration: 5000 });
        this.reportesCompletos = [];
      },
    });
  }

}