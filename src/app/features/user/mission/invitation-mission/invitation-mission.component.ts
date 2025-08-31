import {Component, OnInit} from '@angular/core';
import {MissionResponse} from '../../../../core/services/models/mission-response';
import {PageResponseMissionResponse} from '../../../../core/services/models/page-response-mission-response';
import {MissionService} from '../../../../core/services/services/mission.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-invitation-mission',
  imports: [
    NgClass,
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './invitation-mission.component.html',
  standalone: true,
  styleUrl: './invitation-mission.component.css'
})
export class InvitationMissionComponent implements OnInit {
  missions: MissionResponse[] = [];
  pageResponse!: PageResponseMissionResponse;
  page: number = 0;
  size: number = 10;

  constructor(
    private missionService: MissionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPendingMissions();
  }

  loadPendingMissions() {
    this.missionService.getPendingMissions({ page: this.page, size: this.size }).subscribe({
      next: res => {
        this.missions = res.content || [];
        this.pageResponse = res;
      },
      error: err => console.error(err)
    });
  }
  goToPage(pageNumber: number) {
    if (pageNumber >= 0 && pageNumber < (this.pageResponse?.totalPages || 1)) {
      this.page = pageNumber;
      this.loadPendingMissions();
    }
  }

  rejectMission(mission: MissionResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez rejeter la mission "${mission.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, rejeter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {

        this.missionService.desacceptMission({ missionId: mission.id! }).subscribe({
          next: res => {


            Swal.fire({
              title: 'Rejetée !',
              text: `La mission "${mission.title}" a été rejetée.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: err => {
            console.error(err);
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de rejeter la mission.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  acceptMission1(mission: MissionResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez accepter la mission "${mission.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel du service
        this.missionService.acceptMission({ missionId: mission.id! }).subscribe({
          next: res => {
            // Mise à jour locale ou rechargement de la liste
            mission.status = 'IN_PROGRESS'; // ou la valeur retournée par le backend

            Swal.fire({
              title: 'Acceptée !',
              text: `La mission "${mission.title}" a été acceptée.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home/subscribe-user-mission']);
            });
          },
          error: err => {
            console.error(err);
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible d’accepter la mission.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  showMissionDetails(mission: MissionResponse) {
    this.router.navigate(['/home/show-details-mission', mission.id]);
  }
}
