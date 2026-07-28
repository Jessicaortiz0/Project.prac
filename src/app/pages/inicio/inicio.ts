import { Component, inject, OnInit, signal } from '@angular/core';
import { StudentCard } from '../../shared/components/student-card/student-card';
import { Estudiante } from '../../models/estudiante.model';
import { EstudianteService } from '../../services/estudiante.service';

@Component({ selector: 'app-inicio', imports: [StudentCard], templateUrl: './inicio.html', styleUrl: './inicio.css' })
export class InicioPage implements OnInit {
  private readonly estudianteService = inject(EstudianteService);
  readonly estudiantes = signal<Estudiante[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (estudiantes) => { this.estudiantes.set(estudiantes); this.cargando.set(false); },
      error: () => { this.error.set('No fue posible cargar los estudiantes.'); this.cargando.set(false); }
    });
  }
}
