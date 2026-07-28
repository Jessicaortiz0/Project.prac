import { Routes } from '@angular/router';
import { CarrerasPage } from './pages/carreras/carreras';
import { EstudiantesPage } from './pages/estudiantes/estudiantes';
import { InicioPage } from './pages/inicio/inicio';
import { InscripcionesPage } from './pages/inscripciones/inscripciones';
import { MateriasPage } from './pages/materias/materias';

export const routes: Routes = [
  { path: '', component: InicioPage, title: 'Inicio | Portal académico' },
  { path: 'estudiantes', component: EstudiantesPage, title: 'Estudiantes | Portal académico' },
  { path: 'inscripciones', component: InscripcionesPage, title: 'Registro | Portal académico' },
  { path: 'materias', component: MateriasPage, title: 'Materias | Portal académico' },
  { path: 'carreras', component: CarrerasPage, title: 'Carreras | Portal académico' },
  { path: '**', redirectTo: '' }
];
