import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, NuevoEstudiante } from '../modelos/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3002/estudiantes';

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  agregarEstudiante(estudiante: NuevoEstudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }
}

export { Estudiante };
