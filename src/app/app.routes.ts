import { Routes } from '@angular/router';
import {VolunteerLayoutComponent} from './core/layouts/volunteer-layout/volunteer-layout.component';

import {LoginComponent} from './features/auth/login/login.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {VerifyEmailComponent} from './features/auth/verify-email/verify-email.component';
import {ResetPasswordComponent} from './features/auth/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './features/auth/forgot-password/forgot-password.component';
import {AuthLayoutComponent} from './core/layouts/auth-layout/auth-layout.component';
import {FindAllMissionComponent} from './features/admin/mission/find-all-mission/find-all-mission.component';
import {
  ShowDetailsMissionComponent
} from './features/admin/mission/show-details-mission/show-details-mission.component';
import {CreateMissionComponent} from './features/admin/mission/create-mission/create-mission.component';
import {UpdateMissionComponent} from './features/admin/mission/update-mission/update-mission.component';
import {AsseignMissionComponent} from './features/admin/mission/asseign-mission/asseign-mission.component';
import {InvitationMissionComponent} from './features/user/mission/invitation-mission/invitation-mission.component';
import {SubscribedMissionComponent} from './features/user/mission/subscribed-mission/subscribed-mission.component';
import {AdminDashboardComponent} from './features/admin/admin-dashboard/admin-dashboard.component';
import {MainComponent} from './features/chat/main/main.component';
import {NotificationComponent} from './features/notification/notification.component';
import {UserProfileComponent} from './features/user-profile/user-profile.component';
import {UpdateUserProfileComponent} from './features/update-user-profile/update-user-profile.component';


export const routes: Routes = [
  {path: 'home' ,component: VolunteerLayoutComponent, children:[
      {path: 'show-mission' ,component: FindAllMissionComponent},
      {path: 'add-mission' ,component: CreateMissionComponent},
      {path: 'update-mission/:id' ,component: UpdateMissionComponent},
      {path: 'show-details-mission/:id' ,component: ShowDetailsMissionComponent},
      {path: 'asseign-user-mission/:id' ,component: AsseignMissionComponent},
      {path: 'invitation-user-mission' ,component: InvitationMissionComponent},
      {path: 'subscribe-user-mission' ,component: SubscribedMissionComponent},
      {path: 'admin-dashboard' ,component: AdminDashboardComponent},
      {path: 'chat' ,component: MainComponent},
      {path: 'notifications' ,component: NotificationComponent},
      {path: 'user-profile' ,component: UserProfileComponent},
      {path: 'update-user-profile' ,component: UpdateUserProfileComponent},


    ]},


  {path: '' ,component: AuthLayoutComponent,
  children:[
    {path: '' ,component: LoginComponent},
    {path: 'register' ,component: RegisterComponent},
    {path: 'verify-email' ,component: VerifyEmailComponent},
    {path: 'reset-password' ,component: ResetPasswordComponent},
    {path: 'forgot-password' ,component: ForgotPasswordComponent}
  ]
  },

];
