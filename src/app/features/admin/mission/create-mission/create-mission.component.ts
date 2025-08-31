import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MissionService} from '../../../../core/services/services/mission.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {MissionRequest} from '../../../../core/services/models/mission-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-mission',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-mission.component.html',
  standalone: true,
  styleUrl: './create-mission.component.css'
})
export class CreateMissionComponent implements OnInit{
  public missionForm: FormGroup;
  public submitted = false;

  skills = ['COMMUNICATION', 'ORGANIZATION', 'IT', 'TEACHING', 'FIRST_AID', 'LOGISTICS', 'PSYCHOLOGICAL_SUPPORT', 'LEADERSHIP'];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private router: Router
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

  onSubmit() {
    this.submitted = true;

    if (this.missionForm.invalid) return;
    console.log(this.missionForm.value);

    const missionRequest: MissionRequest = this.missionForm.value as MissionRequest;

    this.missionService.createMission({
      body: missionRequest,
    }).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: 'Succès !',
          text: 'Ajout effectué',
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
  }
}
