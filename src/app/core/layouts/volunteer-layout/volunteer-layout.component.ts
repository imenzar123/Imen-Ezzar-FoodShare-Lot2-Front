import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../components/header/header.component';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-volunteer-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './volunteer-layout.component.html',
  standalone: true,
  styleUrl: './volunteer-layout.component.css'
})
export class VolunteerLayoutComponent {

}
