import { Component } from '@angular/core';
import { ListaEstudiantes } from '../lista-estudiantes/lista-estudiantes';

@Component({
  selector: 'app-inscripciones-vista',
  imports: [ListaEstudiantes],
  template: '<app-lista-estudiantes seccion="inscripciones"></app-lista-estudiantes>'
})
export class InscripcionesVista {}
