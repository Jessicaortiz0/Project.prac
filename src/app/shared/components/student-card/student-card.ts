import { Component, input, output } from '@angular/core';
import { Estudiante } from '../../../models/estudiante.model';

@Component({
  selector: 'app-student-card',
  templateUrl: './student-card.html',
  styleUrl: './student-card.css'
})
export class StudentCard {
  readonly estudiante = input.required<Estudiante>();
  readonly numero = input.required<number>();
  readonly editable = input(false);
  readonly seleccionar = output<Estudiante>();

  abrirFicha(): void {
    if (this.editable()) this.seleccionar.emit(this.estudiante());
  }
}
