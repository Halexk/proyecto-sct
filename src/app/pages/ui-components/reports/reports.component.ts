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
import 'jspdf-autotable';

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
  ) {
    console.log('ReportsService:', reportsService); // Verifica que ReportsService no sea null
    console.log('SnackBar:', snackBar); // Verifica que SnackBar no sea null
   }

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
  formatDatepdf(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Solo año, mes y día
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
    const fechaInicio = this.reportForm.get('fechaInicio')?.value;
    const fechaFin = this.reportForm.get('fechaFin')?.value;
    if (!fechaInicio || !fechaFin) {
      this.snackBar.open('Las fechas de inicio y fin son requeridas', 'Cerrar', { duration: 5000 });
      return;
    }
    const fechaInicioFormateada = this.formatDatepdf(new Date(fechaInicio));
    const fechaFinFormateada = this.formatDatepdf(new Date(fechaFin));


    const doc = new jsPDF('p', 'mm', 'a4');
  
    // Título del reporte
    doc.setFontSize(18);
    doc.text(`Reporte Completo ${fechaFinFormateada}  ${fechaInicioFormateada}`, 10, 20);
  
    // Datos para la tabla de reportes completos
    const reportesTableData = this.reportesCompletos.map((reporte, index) => [
      index + 1, // Número de reporte
      reporte.bienNacional,
      reporte.estado_anterior,
      reporte.estado_nuevo,
      reporte.ubicacion_anterior,
      reporte.ubicacion_nueva,
      reporte.motivo,
      reporte.observacion,
      new Date(reporte.created_at).toLocaleString(), // Fecha formateada
    ]);
  
    // Columnas de la tabla de reportes completos
    const reportesTableColumns = [
      '#',
      'Bien Nacional',
      'Estado Anterior',
      'Estado Nuevo',
      'Ubicación Anterior',
      'Ubicación Nueva',
      'Motivo',
      'Observación',
      'Fecha',
    ];
  
    // Agregar la tabla de reportes completos al PDF
    (doc as any).autoTable({
      head: [reportesTableColumns], // Encabezados de la tabla
      body: reportesTableData, // Datos de la tabla
      startY: 30, // Posición inicial de la tabla (debajo del título)
      theme: 'grid', // Estilo de la tabla (grid, striped, plain)
      styles: { fontSize: 10 }, // Tamaño de la fuente
      headStyles: { fillColor: [41, 128, 185] }, // Color de fondo del encabezado
    });
  
    // Datos para la tabla de resumen
    const resumenTableData = [];
  
    if (this.reparadosData && this.reparadosData.length > 0) {
      resumenTableData.push(['Equipos Reparados', this.reparadosData[0].totalReparados]);
    }
  
    if (this.tiempoReparacionData && this.tiempoReparacionData.length > 0) {
      resumenTableData.push(['Tiempo Promedio de Reparación', `${this.tiempoReparacionData[0].tiempoPromedio} horas`]);
    }
  
    // Columnas de la tabla de resumen
    const resumenTableColumns = ['Resumen', 'Valor'];
  
    // Agregar la tabla de resumen al PDF
    if (resumenTableData.length > 0) {
      (doc as any).autoTable({
        head: [resumenTableColumns], // Encabezados de la tabla
        body: resumenTableData, // Datos de la tabla
        startY: (doc as any).lastAutoTable.finalY + 20, // Posición inicial de la tabla (debajo de la tabla anterior)
        theme: 'grid', // Estilo de la tabla
        styles: { fontSize: 10 }, // Tamaño de la fuente
        headStyles: { fillColor: [41, 128, 185] }, // Color de fondo del encabezado
      });
    }
  
    // Guardar el PDF
    doc.save(`reporte-completo_${fechaFinFormateada}_${fechaInicioFormateada}.pdf`);
  }

  descargarExcel() {
    const fechaInicio = this.reportForm.get('fechaInicio')?.value;
    const fechaFin = this.reportForm.get('fechaFin')?.value;
    if (!fechaInicio || !fechaFin) {
      this.snackBar.open('Las fechas de inicio y fin son requeridas', 'Cerrar', { duration: 5000 });
      return;
    }
    
    const fechaInicioFormateada = this.formatDatepdf(new Date(fechaInicio));
    const fechaFinFormateada = this.formatDatepdf(new Date(fechaFin));

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
    XLSX.writeFile(wb, `reporte-completo_${fechaFinFormateada}_${fechaInicioFormateada}.xlsx`);
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