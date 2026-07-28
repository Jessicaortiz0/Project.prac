import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { StudentCard } from '../../shared/components/student-card/student-card';
import { Estudiante } from '../../models/estudiante.model';
import { EstudianteService } from '../../services/estudiante.service';
import { CatalogoMateriasService } from '../../services/catalogo-materias.service';

@Component({ selector: 'app-estudiantes', imports: [FormsModule, StudentCard], templateUrl: './estudiantes.html', styleUrl: './estudiantes.css' })
export class EstudiantesPage implements OnInit {
  private readonly estudianteService = inject(EstudianteService);
  private readonly catalogoService = inject(CatalogoMateriasService);
  readonly estudiantes = signal<Estudiante[]>([]); readonly materiasDisponibles = signal<string[]>([]); readonly seleccionadoId = signal<Estudiante['id'] | null>(null);
  readonly materiaNueva = signal(''); readonly guardando = signal(false); readonly confirmarEliminacion = signal(false); readonly mensaje = signal(''); readonly error = signal(''); readonly cargando = signal(true);
  readonly seleccionado = computed(() => this.estudiantes().find((estudiante) => estudiante.id === this.seleccionadoId()));
  ngOnInit(): void { this.cargar(); this.catalogoService.obtenerMaterias().subscribe({ next: (materias) => this.materiasDisponibles.set(materias.map((m) => m.nombre)), error: () => this.error.set('No fue posible cargar las materias.') }); }
  cargar(): void { this.estudianteService.obtenerEstudiantes().subscribe({ next: (estudiantes) => { this.estudiantes.set(estudiantes); this.cargando.set(false); }, error: () => { this.error.set('No fue posible cargar los estudiantes.'); this.cargando.set(false); } }); }
  seleccionar(estudiante: Estudiante): void { this.seleccionadoId.set(estudiante.id); this.materiaNueva.set(''); this.confirmarEliminacion.set(false); this.error.set(''); }
  cerrar(): void { this.seleccionadoId.set(null); this.materiaNueva.set(''); this.confirmarEliminacion.set(false); }
  agregarMateria(estudiante: Estudiante): void { const materia = this.materiaNueva(); const actuales = estudiante.materias ?? []; if (!materia || actuales.includes(materia)) return; this.guardarMaterias(estudiante, [...actuales, materia], 'Materia agregada correctamente.'); }
  quitarMateria(estudiante: Estudiante, materia: string): void { this.guardarMaterias(estudiante, (estudiante.materias ?? []).filter((actual) => actual !== materia), 'Materia eliminada correctamente.'); }
  eliminar(estudiante: Estudiante): void { if (this.guardando()) return; this.guardando.set(true); this.estudianteService.eliminarEstudiante(estudiante.id).subscribe({ next: () => { const restantes = this.estudiantes().filter((actual) => actual.id !== estudiante.id); this.estudiantes.set(restantes); this.reordenar(restantes); this.cerrar(); this.mensaje.set('Estudiante eliminado correctamente.'); this.guardando.set(false); }, error: () => { this.error.set('No fue posible eliminar el estudiante.'); this.guardando.set(false); } }); }
  private guardarMaterias(estudiante: Estudiante, materias: string[], mensaje: string): void { if (this.guardando()) return; this.guardando.set(true); this.estudianteService.actualizarEstudiante(estudiante.id, { materias }).subscribe({ next: (actualizado) => { this.estudiantes.update((lista) => lista.map((actual) => actual.id === actualizado.id ? actualizado : actual)); this.materiaNueva.set(''); this.mensaje.set(mensaje); this.guardando.set(false); }, error: () => { this.error.set('No fue posible actualizar las materias.'); this.guardando.set(false); } }); }
  private reordenar(estudiantes: Estudiante[]): void { if (!estudiantes.length) return; forkJoin(estudiantes.map((estudiante, indice) => this.estudianteService.actualizarEstudiante(estudiante.id, { numero: indice + 1 }))).subscribe({ next: (actualizados) => this.estudiantes.set(actualizados) }); }
}
