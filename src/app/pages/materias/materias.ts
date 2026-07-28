import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoMateriasService } from '../../services/catalogo-materias.service';

@Component({ selector: 'app-materias', imports: [FormsModule], templateUrl: './materias.html', styleUrl: './materias.css' })
export class MateriasPage implements OnInit {
  private readonly catalogoService = inject(CatalogoMateriasService);
  readonly materias = signal<string[]>([]); readonly nuevaMateria = signal(''); readonly guardando = signal(false); readonly mensaje = signal(''); readonly error = signal('');
  ngOnInit(): void { this.catalogoService.obtenerMaterias().subscribe({ next: (materias) => this.materias.set(materias.map((m) => m.nombre)), error: () => this.error.set('No fue posible cargar el catálogo.') }); }
  crear(): void { const nombre = this.nuevaMateria().trim(); if (!nombre || this.guardando()) return; if (this.materias().some((materia) => materia.toLowerCase() === nombre.toLowerCase())) { this.error.set('Esta materia ya aparece en el catálogo.'); return; } this.guardando.set(true); this.catalogoService.agregarMateria(nombre).subscribe({ next: (materia) => { this.materias.update((actuales) => [...actuales, materia.nombre]); this.nuevaMateria.set(''); this.mensaje.set('Materia creada correctamente.'); this.guardando.set(false); }, error: () => { this.error.set('No fue posible guardar la materia.'); this.guardando.set(false); } }); }
}
