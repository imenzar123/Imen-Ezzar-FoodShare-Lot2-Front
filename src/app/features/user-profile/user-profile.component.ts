import {Component, OnInit} from '@angular/core';
import {UserProfileResponse} from '../../core/services/models/user-profile-response';
import {UserControllerService} from '../../core/services/services/user-controller.service';
import {DatePipe, DecimalPipe, NgClass, NgIf} from '@angular/common';
import {UserStatsResponse} from '../../core/services/models/user-stats-response';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgClass,
    DatePipe,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  profile: UserProfileResponse | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private userService: UserControllerService,
              private router: Router,
              ) {}
  ngOnInit() {
    this.loadMyProfile();
  }

  loadMyProfile() {
    this.isLoading = true;
    this.error = null;

    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du profil';
        this.isLoading = false;
        console.error('Error loading profile:', error);
      }
    });
  }

  getBadgeIcon(badgeName: string): string {
    const icons: { [key: string]: string } = {
      'Novice': '🥉',
      'Débutant': '🥈',
      'Explorateur': '🥇',
      'Champion': '🏆',
      'Légende': '👑'
    };
    return icons[badgeName] || '🎯';
  }

  getProgressBarClass(percentage: number): string {
    if (percentage < 25) return 'progress-bar-danger';
    if (percentage < 50) return 'progress-bar-warning';
    if (percentage < 75) return 'progress-bar-info';
    return 'progress-bar-success';
  }

  getSkillIcon(skill: string): string {
    const icons: { [key: string]: string } = {
      'COMMUNICATION': '💬',
      'ORGANIZATION': '📊',
      'IT': '💻',
      'TEACHING': '📚',
      'FIRST_AID': '🩹',
      'LOGISTICS': '🚚',
      'PSYCHOLOGICAL_SUPPORT': '🧠',
      'LEADERSHIP': '👑'
    };
    return icons[skill] || '🌟';
  }

  getGenderIcon(gender: string): string {
    return gender === 'MALE' ? '👨' : '👩';
  }

  refreshProfile() {
    this.loadMyProfile();
  }

  updateProfile() {
    this.router.navigate(['/home/update-user-profile']);
  }
}
