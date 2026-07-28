import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoMateriasService } from '../../services/catalogo-materias.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NuevoEstudiante } from '../../models/estudiante.model';

@Component({ selector: 'app-inscripciones', imports: [FormsModule], templateUrl: './inscripciones.html', styleUrl: './inscripciones.css' })
export class InscripcionesPage implements OnInit {
  private readonly estudianteService = inject(EstudianteService);
  private readonly catalogoService = inject(CatalogoMateriasService);
  readonly nombre = signal(''); readonly edad = signal<number | null>(null); readonly carrera = signal(''); readonly jornada = signal('');
  readonly materias = signal<string[]>([]); readonly materiasDisponibles = signal<string[]>([]); readonly guardando = signal(false); readonly mensaje = signal(''); readonly error = signal('');
  readonly carreras = ['Marketing', 'Turismo', 'Administración', 'Diseño Gráfico', 'Redes y Telecomunicaciones', 'Desarrollo de Software', 'Enfermería', 'Gastronomía'];
  readonly jornadas = ['Matutina', 'Vespertina', 'Nocturna'];

  ngOnInit(): void { this.catalogoService.obtenerMaterias().subscribe({ next: (materias) => this.materiasDisponibles.set(materias.map((m) => m.nombre)), error: () => this.error.set('No fue posible cargar las materias.') }); }
  alternarMateria(materia: string): void { this.materias.update((actuales) => actuales.includes(materia) ? actuales.filter((actual) => actual !== materia) : [...actuales, materia]); }
  registrar(): void {
    const nombre = this.nombre().trim(); const edad = this.edad(); const carrera = this.carrera(); const jornada = this.jornada(); const materias = this.materias();
    if (!nombre || !edad || !carrera || !jornada || !materias.length || this.guardando()) return;
    this.guardando.set(true); this.error.set('');
    this.estudianteService.obtenerEstudiantes().subscribe({ next: (lista) => {
      const estudiante: NuevoEstudiante = { nombre, edad, carrera, jornada, materias, numero: lista.length + 1 };
      this.estudianteService.agregarEstudiante(estudiante).subscribe({ next: () => { this.nombre.set(''); this.edad.set(null); this.carrera.set(''); this.jornada.set(''); this.materias.set([]); this.mensaje.set('Estudiante registrado correctamente.'); this.guardando.set(false); }, error: () => { this.error.set('No fue posible guardar el estudiante.'); this.guardando.set(false); } });
    }, error: () => { this.error.set('No fue posible preparar el registro.'); this.guardando.set(false); } });
  }
}
