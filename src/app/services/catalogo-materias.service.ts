import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MateriaCatalogo } from '../models/materia-catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoMateriasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002/catalogoMaterias';

  obtenerMaterias(): Observable<MateriaCatalogo[]> {
    return this.http.get<MateriaCatalogo[]>(this.apiUrl);
  }

  agregarMateria(nombre: string): Observable<MateriaCatalogo> {
    return this.http.post<MateriaCatalogo>(this.apiUrl, { nombre });
  }
}
