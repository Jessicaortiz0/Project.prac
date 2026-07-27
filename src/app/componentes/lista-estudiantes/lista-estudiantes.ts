import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
  readonly seccion = input<'inicio' | 'estudiantes' | 'inscripciones' | 'materias'>('inicio');
  readonly tituloSeccion = computed(() => {
    const titulos = {
      inicio: 'Lista de estudiantes',
      estudiantes: 'Estudiantes inscritos',
      inscripciones: 'Registro de estudiante',
      materias: 'Materias disponibles'
    };
    return titulos[this.seccion()];
  });
  readonly descripcionSeccion = computed(() => {
    const descripciones = {
      inicio: 'Información actualizada desde el registro académico.',
      estudiantes: 'Consulta los estudiantes que ya se encuentran registrados.',
      inscripciones: 'Completa los datos para registrar un nuevo estudiante.',
      materias: 'Administra las materias disponibles para los estudiantes.'
    };
    return descripciones[this.seccion()];
  });

  readonly estudiantes = signal<Estudiante[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly guardando = signal(false);
  readonly mensaje = signal('');
  readonly estudianteSeleccionadoId = signal<Estudiante['id'] | null>(null);
  readonly materiaParaAgregar = signal('');
  readonly guardandoMaterias = signal(false);
  readonly errorMaterias = signal('');
  readonly confirmarEliminacion = signal(false);
  readonly eliminandoEstudiante = signal(false);
  readonly estudianteSeleccionado = computed(() =>
    this.estudiantes().find((estudiante) => estudiante.id === this.estudianteSeleccionadoId())
  );

  readonly nombreNuevo = signal('');
  readonly edadNueva = signal<number | null>(null);
  readonly carreraNueva = signal('');
  readonly jornadaNueva = signal('');
  readonly materiasParaRegistro = signal<string[]>([]);
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
  readonly jornadas = ['Matutina', 'Vespertina', 'Nocturna'];
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
    const jornada = this.jornadaNueva();
    const materias = this.materiasParaRegistro();

    if (!nombre || !edad || !carrera || !jornada || materias.length === 0 || this.guardando()) return;

    this.guardando.set(true);
    this.mensaje.set('');

    const estudiante: NuevoEstudiante = {
      nombre,
      edad,
      carrera,
      jornada,
      materias,
      numero: this.estudiantes().length + 1
    };
    this.estudianteService.agregarEstudiante(estudiante).subscribe({
      next: (creado) => {
        this.estudiantes.update((lista) => [...lista, creado]);
        this.nombreNuevo.set('');
        this.edadNueva.set(null);
        this.carreraNueva.set('');
        this.jornadaNueva.set('');
        this.materiasParaRegistro.set([]);
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
    this.confirmarEliminacion.set(false);
  }

  quitarMateriaRegistro(materia: string): void {
    this.materiasParaRegistro.update((materias) =>
      materias.filter((actual) => actual !== materia)
    );
  }

  alternarMateriaRegistro(materia: string): void {
    if (this.materiasParaRegistro().includes(materia)) {
      this.quitarMateriaRegistro(materia);
      return;
    }

    this.materiasParaRegistro.update((materias) => [...materias, materia]);
  }

  cerrarGestionMaterias(): void {
    this.estudianteSeleccionadoId.set(null);
    this.materiaParaAgregar.set('');
    this.errorMaterias.set('');
    this.confirmarEliminacion.set(false);
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

  eliminarEstudiante(estudiante: Estudiante): void {
    if (this.eliminandoEstudiante()) return;

    this.eliminandoEstudiante.set(true);
    this.errorMaterias.set('');

    this.estudianteService.eliminarEstudiante(estudiante.id).subscribe({
      next: () => {
        const estudiantesRestantes = this.estudiantes().filter(
          (actual) => actual.id !== estudiante.id
        );
        this.estudiantes.set(estudiantesRestantes);
        this.reordenarNumeros(estudiantesRestantes);
        this.cerrarGestionMaterias();
        this.mensaje.set('Estudiante eliminado correctamente.');
        this.eliminandoEstudiante.set(false);
      },
      error: () => {
        this.errorMaterias.set('No fue posible eliminar el estudiante de la API.');
        this.eliminandoEstudiante.set(false);
      }
    });
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

  private reordenarNumeros(estudiantes: Estudiante[]): void {
    if (estudiantes.length === 0) return;

    forkJoin(
      estudiantes.map((estudiante, indice) =>
        this.estudianteService.actualizarEstudiante(estudiante.id, { numero: indice + 1 })
      )
    ).subscribe({
      next: (actualizados) => this.estudiantes.set(actualizados),
      error: () => this.errorMaterias.set('El estudiante fue eliminado, pero no se pudo reordenar la numeración.')
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
