import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MissionResponse} from '../../../../core/services/models/mission-response';
import {PageResponseMissionResponse} from '../../../../core/services/models/page-response-mission-response';
import {MissionService} from '../../../../core/services/services/mission.service';
import {DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-show-details-mission',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './show-details-mission.component.html',
  standalone: true,
  styleUrl: './show-details-mission.component.css'
})
export class ShowDetailsMissionComponent implements OnInit{
  missionId!: number;
  mission!: MissionResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.missionId = +this.route.snapshot.paramMap.get('id')!;


    this.missionService.getMissionById({ id: this.missionId }).subscribe({
      next: (res: MissionResponse) => {
        this.mission = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
