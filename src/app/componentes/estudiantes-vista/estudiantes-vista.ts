import { Component } from '@angular/core';
import { ListaEstudiantes } from '../lista-estudiantes/lista-estudiantes';

@Component({
  selector: 'app-estudiantes-vista',
  imports: [ListaEstudiantes],
  template: '<app-lista-estudiantes seccion="estudiantes"></app-lista-estudiantes>'
})
export class EstudiantesVista {}
