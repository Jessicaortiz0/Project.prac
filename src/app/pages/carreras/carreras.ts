import { Component } from '@angular/core';

@Component({ selector: 'app-carreras', templateUrl: './carreras.html', styleUrl: './carreras.css' })
export class CarrerasPage {
  readonly carreras = ['Marketing', 'Turismo', 'Administración', 'Diseño Gráfico', 'Redes y Telecomunicaciones', 'Desarrollo de Software', 'Enfermería', 'Gastronomía'];
}
