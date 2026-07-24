import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  readonly estudianteSeleccionadoId = signal<Estudiante['id'] | null>(null);
  readonly materiaParaAgregar = signal('');
  readonly guardandoMaterias = signal(false);
  readonly errorMaterias = signal('');
  readonly estudianteSeleccionado = computed(() =>
    this.estudiantes().find((estudiante) => estudiante.id === this.estudianteSeleccionadoId())
  );

  readonly nombreNuevo = signal('');
  readonly edadNueva = signal<number | null>(null);
  readonly carreraNueva = signal('');
  readonly materiasNueva = signal('');
  readonly nuevaMateriaCatalogo = signal('');
  readonly guardandoCatalogo = signal(false);
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
  readonly materiasDisponibles = signal<string[]>([]);

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

    this.estudianteService.obtenerCatalogoMaterias().subscribe({
      next: (materias) => this.materiasDisponibles.set(materias.map((materia) => materia.nombre)),
      error: () => this.errorMaterias.set('No fue posible cargar el catálogo de materias.')
    });
  }

  agregarEstudiante(): void {
    const nombre = this.nombreNuevo().trim();
    const edad = this.edadNueva();
    const carrera = this.carreraNueva();
    const materiaInicial = this.materiasNueva();

    if (!nombre || !edad || !carrera || !materiaInicial || this.guardando()) return;

    this.guardando.set(true);
    this.mensaje.set('');

    const estudiante: NuevoEstudiante = { nombre, edad, carrera, materias: [materiaInicial] };
    this.estudianteService.agregarEstudiante(estudiante).subscribe({
      next: (creado) => {
        this.estudiantes.update((lista) => [...lista, creado]);
        this.nombreNuevo.set('');
        this.edadNueva.set(null);
        this.carreraNueva.set('');
        this.materiasNueva.set('');
        this.mensaje.set('Estudiante agregado correctamente.');
        this.guardando.set(false);
      },
      error: () => {
        this.error.set('No fue posible guardar el estudiante en la API');
        this.guardando.set(false);
      }
    });
  }

  seleccionarEstudiante(estudiante: Estudiante): void {
    this.estudianteSeleccionadoId.set(estudiante.id);
    this.materiaParaAgregar.set('');
    this.errorMaterias.set('');
  }

  cerrarGestionMaterias(): void {
    this.estudianteSeleccionadoId.set(null);
    this.materiaParaAgregar.set('');
    this.errorMaterias.set('');
  }

  agregarMateria(estudiante: Estudiante): void {
    const materia = this.materiaParaAgregar().trim();
    const materiasActuales = estudiante.materias ?? [];

    if (!materia || this.guardandoMaterias()) return;

    if (materiasActuales.some((actual) => actual.toLowerCase() === materia.toLowerCase())) {
      this.errorMaterias.set('Esta materia ya está asignada a este estudiante.');
      return;
    }

    this.guardarMaterias(estudiante, [...materiasActuales, materia], 'Materia agregada correctamente.');
  }

  quitarMateria(estudiante: Estudiante, materia: string): void {
    if (this.guardandoMaterias()) return;

    const materiasActualizadas = (estudiante.materias ?? []).filter(
      (actual) => actual !== materia
    );
    this.guardarMaterias(estudiante, materiasActualizadas, 'Materia eliminada correctamente.');
  }

  private guardarMaterias(estudiante: Estudiante, materias: string[], mensaje: string): void {
    this.guardandoMaterias.set(true);
    this.errorMaterias.set('');

    this.estudianteService.actualizarEstudiante(estudiante.id, { materias }).subscribe({
      next: (actualizado) => {
        this.estudiantes.update((lista) =>
          lista.map((actual) => (actual.id === actualizado.id ? actualizado : actual))
        );
        this.materiaParaAgregar.set('');
        this.mensaje.set(mensaje);
        this.guardandoMaterias.set(false);
      },
      error: () => {
        this.errorMaterias.set('No fue posible actualizar las materias en la API.');
        this.guardandoMaterias.set(false);
      }
    });
  }

  crearMateriaCatalogo(): void {
    const nombre = this.nuevaMateriaCatalogo().trim();
    const materiaExistente = this.materiasDisponibles().some(
      (materia) => materia.toLowerCase() === nombre.toLowerCase()
    );

    if (!nombre || this.guardandoCatalogo()) return;

    if (materiaExistente) {
      this.errorMaterias.set('Esta materia ya aparece entre las opciones.');
      return;
    }

    this.guardandoCatalogo.set(true);
    this.errorMaterias.set('');
    this.estudianteService.agregarMateriaAlCatalogo(nombre).subscribe({
      next: (materia) => {
        this.materiasDisponibles.update((materias) => [...materias, materia.nombre]);
        this.nuevaMateriaCatalogo.set('');
        this.mensaje.set('Materia creada. Ya puedes seleccionarla en “Elige una materia”.');
        this.guardandoCatalogo.set(false);
      },
      error: () => {
        this.errorMaterias.set('No fue posible guardar la materia en el catálogo.');
        this.guardandoCatalogo.set(false);
      }
    });
  }
}
