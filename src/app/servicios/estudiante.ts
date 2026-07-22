import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, timeout } from 'rxjs';
import { Estudiante } from '../modelos/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/estudiantes';

  private estudiantesDeRespaldo: Estudiante[] = [
    { id: 1, nombre: 'María', edad: 20, carrera: 'Desarrollo de Software' },
    { id: 2, nombre: 'Carlos', edad: 22, carrera: 'Diseño Gráfico' },
    { id: 3, nombre: 'Ana', edad: 19, carrera: 'Administración' }
  ];

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      timeout(4000),
      catchError(() => of(this.estudiantesDeRespaldo))
    );
  }
}
