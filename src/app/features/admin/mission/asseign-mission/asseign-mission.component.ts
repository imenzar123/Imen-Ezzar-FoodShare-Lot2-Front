import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';


import {User} from '../../../../core/services/models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UserControllerService} from '../../../../core/services/services/user-controller.service';
import {MissionService} from '../../../../core/services/services/mission.service';
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asseign-mission',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './asseign-mission.component.html',
  standalone: true,
  styleUrl: './asseign-mission.component.css'
})
export class AsseignMissionComponent implements OnInit{
  users: User[] = [];
  missionId!: number;
  assignForm!: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserControllerService,
    private missionService: MissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  get f() {
    return this.assignForm.controls;
  }
  ngOnInit(): void {
    this.missionId = +this.route.snapshot.paramMap.get('id')!;
    this.assignForm = this.fb.group({
      userId: [null, Validators.required]
    });


    this.userService.getAllUsers().subscribe({
      next: (res) => this.users = res,
      error: (err) => console.error(err)
    });
  }

  onAssign() {
    this.submitted = true;

    if (this.assignForm.invalid) {
      return;
    }

    const userId = this.assignForm.value.userId;

    Swal.fire({
      title: 'Confirmer l\'assignation ?',
      text: `Voulez-vous assigner cette mission à l'utilisateur sélectionné ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.missionService.assignUser({ missionId: this.missionId, userId }).subscribe({
          next: () => {
            Swal.fire('Assigné !', 'La mission a été assignée avec succès.', 'success').then(() => {
              this.router.navigate(['/home/show-mission']);
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Impossible d\'assigner la mission.', 'error');
          }
        });
      }
    });
  }
}
