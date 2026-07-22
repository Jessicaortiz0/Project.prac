import { Estudiante } from './estudiante.model';

describe('Estudiante', () => {
  it('debería crear un estudiante', () => {
    const estudiante = new Estudiante(
      1,
      'Estudiante de prueba',
      18,
      'Carrera de prueba'
    );

    expect(estudiante).toBeTruthy();
  });
});