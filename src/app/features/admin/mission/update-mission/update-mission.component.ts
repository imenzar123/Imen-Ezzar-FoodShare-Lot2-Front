import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MissionService} from '../../../../core/services/services/mission.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MissionRequest} from '../../../../core/services/models/mission-request';
import Swal from 'sweetalert2';
import {NgForOf, NgIf} from '@angular/common';
import {MissionResponse} from '../../../../core/services/models/mission-response';

@Component({
  selector: 'app-update-mission',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './update-mission.component.html',
  standalone: true,
  styleUrl: './update-mission.component.css'
})
export class UpdateMissionComponent implements  OnInit{
  public missionForm: FormGroup;
  public submitted = false;
  missionId!: number;
  skills = ['COMMUNICATION', 'ORGANIZATION', 'IT', 'TEACHING', 'FIRST_AID', 'LOGISTICS', 'PSYCHOLOGICAL_SUPPORT', 'LEADERSHIP'];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.missionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      requiredSkill: ['', Validators.required],

    });
  }

  get f() {
    return this.missionForm.controls;
  }
  loadMission() {
    this.missionService.getMissionById({ id: this.missionId }).subscribe({
      next: (res: MissionResponse) => {
        this.missionForm.patchValue({
          title: res.title,
          description: res.description,
          startDate: res.startDate,
          endDate: res.endDate,
          requiredSkill: res.requiredSkill,

        });
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.missionForm.invalid) return;
    console.log(this.missionForm.value);

    const missionRequest: MissionRequest = this.missionForm.value as MissionRequest;

    this.missionService.updateMission({
      body: missionRequest,
      id: this.missionId,
    }).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: 'Succès !',
          text: 'modification effectué',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home/show-mission']);
        });
      },
      error: () => {
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'ajout',
          icon: 'error',
          confirmButtonText: 'Fermer'
        });
      }
    })
  }
  ngOnInit(): void {
    this.missionId = +this.route.snapshot.paramMap.get('id')!;

    this.loadMission();
  }
}
