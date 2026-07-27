import { Routes } from '@angular/router';
import { CarrerasVista } from './componentes/carreras-vista/carreras-vista';
import { EstudiantesVista } from './componentes/estudiantes-vista/estudiantes-vista';
import { InicioVista } from './componentes/inicio-vista/inicio-vista';
import { InscripcionesVista } from './componentes/inscripciones-vista/inscripciones-vista';
import { MateriasVista } from './componentes/materias-vista/materias-vista';

export const routes: Routes = [
  { path: '', component: InicioVista, title: 'Inicio | Portal académico' },
  { path: 'estudiantes', component: EstudiantesVista, title: 'Estudiantes | Portal académico' },
  { path: 'inscripciones', component: InscripcionesVista, title: 'Registro | Portal académico' },
  { path: 'materias', component: MateriasVista, title: 'Materias | Portal académico' },
  { path: 'carreras', component: CarrerasVista, title: 'Carreras | Portal académico' },
  { path: '**', redirectTo: '' }
];
