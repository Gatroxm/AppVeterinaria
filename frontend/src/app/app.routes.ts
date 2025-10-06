import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PetsComponent } from './features/pets/pets.component';
import { AddPetComponent } from './features/pets/add-pet.component';
import { PetDetailComponent } from './features/pets/pet-detail.component';
import { EditPetComponent } from './features/pets/edit-pet.component';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { AddAppointmentComponent } from './features/appointments/add-appointment.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { MedicalRecordsComponent } from './features/medical-records/medical-records.component';
import { MedicalRecordDetailComponent } from './features/medical-records/medical-record-detail.component';
import { AddMedicalRecordComponent } from './features/medical-records/add-medical-record.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register', 
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'medical-records',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MedicalRecordsComponent
      },
      {
        path: 'new',
        component: AddMedicalRecordComponent
      },
      {
        path: ':id',
        component: MedicalRecordDetailComponent
      }
    ]
  },
  {
    path: 'pets',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PetsComponent
      },
      {
        path: 'new',
        component: AddPetComponent
      },
      {
        path: 'edit/:id',
        component: EditPetComponent
      },
      {
        path: ':id',
        component: PetDetailComponent
      }
    ]
  },
  {
    path: 'appointments',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AppointmentsComponent
      },
      {
        path: 'new',
        component: AddAppointmentComponent
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/appointments/edit-appointment.component').then(c => c.EditAppointmentComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/appointments/appointment-detail.component').then(c => c.AppointmentDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
