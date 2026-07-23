import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estudiante, NuevoEstudiante } from '../../modelos/estudiante.model';
import { EstudianteService } from '../../servicios/estudiante';

@Component({
  selector: 'app-lista-estudiantes',
  imports: [FormsModule],
  templateUrl: './lista-estudiantes.html',
  styleUrl: './lista-estudiantes.css'
})
export class ListaEstudiantes implements OnInit {
  private estudianteService = inject(EstudianteService);

  readonly estudiantes = signal<Estudiante[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly guardando = signal(false);
  readonly mensaje = signal('');

  readonly nombreNuevo = signal('');
  readonly edadNueva = signal<number | null>(null);
  readonly carreraNueva = signal('');
  readonly carreras = [
    'Marketing',
    'Turismo',
    'Administración',
    'Diseño Gráfico',
    'Redes y Telecomunicaciones',
    'Desarrollo de Software',
    'Enfermería',
    'Gastronomia'
   
  ];

  ngOnInit(): void {
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (datos) => {
        this.estudiantes.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible conectar con la API');
        this.cargando.set(false);
      }
    });
  }

  agregarEstudiante(): void {
    const nombre = this.nombreNuevo().trim();
    const edad = this.edadNueva();
    const carrera = this.carreraNueva();

    if (!nombre || !edad || !carrera || this.guardando()) return;

    const estudiante: NuevoEstudiante = { nombre, edad, carrera };
    this.guardando.set(true);
    this.mensaje.set('');

    this.estudianteService.agregarEstudiante(estudiante).subscribe({
      next: (creado) => {
        this.estudiantes.update((lista) => [...lista, creado]);
        this.nombreNuevo.set('');
        this.edadNueva.set(null);
        this.carreraNueva.set('');
        this.mensaje.set('Estudiante agregado correctamente.');
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('No fue posible guardar el estudiante en la API');
        this.guardando.set(false);
      }
    });
  }
}
