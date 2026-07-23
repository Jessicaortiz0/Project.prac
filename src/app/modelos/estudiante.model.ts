export class Estudiante {
  constructor(
    public id: number,
    public nombre: string,
    public edad: number,
    public carrera: string
  ) {}
}

export type NuevoEstudiante = Omit<Estudiante, 'id'>;
