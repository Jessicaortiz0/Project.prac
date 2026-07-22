import { Component, inject, OnInit } from '@angular/core';
import { Estudiante } from '../../modelos/estudiante.model';
import { EstudianteService } from '../../servicios/estudiante';

@Component({
  selector: 'app-lista-estudiantes',
  imports: [],
  templateUrl: './lista-estudiantes.html',
  styleUrl: './lista-estudiantes.css'
})
export class ListaEstudiantes implements OnInit {
  private estudianteService = inject(EstudianteService);

  estudiantes: Estudiante[] = [
    { id: 1, nombre: 'María', edad: 20, carrera: 'Desarrollo de Software' },
    { id: 2, nombre: 'Carlos', edad: 22, carrera: 'Diseño Gráfico' },
    { id: 3, nombre: 'Ana', edad: 19, carrera: 'Administración' }
  ];
  cargando = false;
  error = '';

  ngOnInit(): void {
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (datos) => {
        this.estudiantes = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No fue posible conectar con la API';
        this.cargando = false;
      }
    });
  }
}
