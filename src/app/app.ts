import { Component } from '@angular/core';
import { ListaEstudiantes } from './componentes/lista-estudiantes/lista-estudiantes';

@Component({
  selector: 'app-root',
  imports: [ListaEstudiantes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  titulo = 'Mi aplicación de prueba';
}