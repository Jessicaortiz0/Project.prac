import { Component } from '@angular/core';
import { ListaEstudiantes } from '../lista-estudiantes/lista-estudiantes';

@Component({
  selector: 'app-inicio-vista',
  imports: [ListaEstudiantes],
  template: '<app-lista-estudiantes seccion="inicio"></app-lista-estudiantes>'
})
export class InicioVista {}
