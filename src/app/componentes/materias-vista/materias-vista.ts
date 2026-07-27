import { Component } from '@angular/core';
import { ListaEstudiantes } from '../lista-estudiantes/lista-estudiantes';

@Component({
  selector: 'app-materias-vista',
  imports: [ListaEstudiantes],
  template: '<app-lista-estudiantes seccion="materias"></app-lista-estudiantes>'
})
export class MateriasVista {}
