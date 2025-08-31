import {Component, OnInit} from '@angular/core';
import {MissionResponse} from '../../../../core/services/models/mission-response';
import {PageResponseMissionResponse} from '../../../../core/services/models/page-response-mission-response';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MissionService} from '../../../../core/services/services/mission.service';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-find-all-mission',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './find-all-mission.component.html',
  standalone: true,
  styleUrl: './find-all-mission.component.css'
})
export class FindAllMissionComponent implements OnInit{
  missions: MissionResponse[] = [];
  pageResponse!: PageResponseMissionResponse;
  searchForm!: FormGroup;

  page = 0;
  size = 10;
  constructor(private fb: FormBuilder, private missionService: MissionService,
              private router : Router

  ) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      title: ['']
    });
    this.loadMissions();
  }

  loadMissions() {
    const title = this.searchForm.get('title')?.value || '';
    this.missionService.getMissions({
      title: title,
      page: this.page,
      size: this.size,
    }).subscribe({
      next: (res) => {
        this.pageResponse = res;
        this.missions = res.content ?? [];
        console.log('Missions chargées:', this.missions);
      },
      error: (err) => console.error(err)
    })
  }

  onSearch() {
    this.page = 0; // reset page
    this.loadMissions();
  }

  goToPage(page: number) {
    this.page = page;
    this.loadMissions();
  }

  goToAddMission() {
    this.router.navigate(['/home/add-mission']);
  }

  editMission(mission: MissionResponse) {
    this.router.navigate(['/home/update-mission', mission.id]);
  }

  deleteMission1(mission: MissionResponse) {

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera définitivement la mission !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.missionService.deleteMission({id:mission.id!}).subscribe({
          next: () => {
            Swal.fire(
              'Supprimée !',
              'La mission a été supprimée avec succès.',
              'success'
            );
            this.loadMissions();
          },
          error: () => {
            Swal.fire(
              'Erreur !',
              'La mission n’a pas pu être supprimée.',
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

  assignMission(mission: MissionResponse) {
    this.router.navigate(['/home/asseign-user-mission', mission.id]);
  }

  unassignMission(mission: MissionResponse) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous allez désassigner la mission "${mission.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, désassigner',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.missionService.unassignUser({ missionId: mission.id! }).subscribe({
          next: () => {
            mission.isAsseigned = false; // mise à jour du tableau en direct
            Swal.fire({
              title: 'Désassignée !',
              text: `La mission "${mission.title}" a été désassignée.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de désassigner la mission.',
              icon: 'error'
            });
          }
        });
      }
    });
  }
}
