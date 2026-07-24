import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, MateriaCatalogo, NuevoEstudiante } from '../modelos/estudiante.model';

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

  actualizarEstudiante(
    id: Estudiante['id'],
    cambios: Partial<NuevoEstudiante>
  ): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.apiUrl}/${encodeURIComponent(String(id))}`, cambios);
  }

  obtenerCatalogoMaterias(): Observable<MateriaCatalogo[]> {
    return this.http.get<MateriaCatalogo[]>('http://localhost:3002/catalogoMaterias');
  }

  agregarMateriaAlCatalogo(nombre: string): Observable<MateriaCatalogo> {
    return this.http.post<MateriaCatalogo>('http://localhost:3002/catalogoMaterias', { nombre });
  }
}

export { Estudiante };
