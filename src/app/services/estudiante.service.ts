import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, NuevoEstudiante } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002/estudiantes';

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  agregarEstudiante(estudiante: NuevoEstudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  actualizarEstudiante(id: Estudiante['id'], cambios: Partial<NuevoEstudiante>): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.apiUrl}/${encodeURIComponent(String(id))}`, cambios);
  }

  eliminarEstudiante(id: Estudiante['id']): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(String(id))}`);
  }
}
