export interface Estudiante {
  id: string | number;
  numero?: number;
  nombre: string;
  edad: number;
  carrera: string;
  jornada?: string;
  materias?: string[];
}

export type NuevoEstudiante = Omit<Estudiante, 'id'>;
