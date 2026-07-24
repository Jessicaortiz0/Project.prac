export class Estudiante {
  constructor(
    public id: string | number,
    public nombre: string,
    public edad: number,
    public carrera: string,
    public materias?: string[]
  ) {}
}

export type NuevoEstudiante = Omit<Estudiante, 'id'>;

export interface MateriaCatalogo {
  id: string | number;
  nombre: string;
}
