import {Component, OnInit} from '@angular/core';
import {MissionResponse} from '../../../../core/services/models/mission-response';
import {MissionService} from '../../../../core/services/services/mission.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscribed-mission',
  imports: [
    NgClass,
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './subscribed-mission.component.html',
  standalone: true,
  styleUrl: './subscribed-mission.component.css'
})
export class SubscribedMissionComponent implements OnInit{
  missions: MissionResponse[] = [];
  pageResponse: any;
  page = 0;

  constructor(private missionService: MissionService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions() {
    this.missionService.getInProgressOrCompletedMissions({ page: this.page, size: 10 })
      .subscribe(res => {
        this.missions = res.content!;
        this.pageResponse = res;
      });
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.pageResponse.totalPages) return;
    this.page = page;
    this.loadMissions();
  }

  completeMission(mission: MissionResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez compléter la mission "${mission.title}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, compléter !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.missionService.completeMission({ missionId: mission.id! }).subscribe({
          next: res => {
            Swal.fire(
              'Complétée !',
              `La mission "${mission.title}" a été complétée.`,
              'success'
            );
            // Optionnel : rafraîchir la liste des missions
            this.loadMissions();
          },
          error: err => {
            Swal.fire(
              'Erreur',
              `Impossible de compléter la mission : ${err.message}`,
              'error'
            );
          }
        });
      }
    });
  }

  showMissionDetails(mission: MissionResponse) {
    this.router.navigate(['/home/show-details-mission', mission.id]);
  }

}
