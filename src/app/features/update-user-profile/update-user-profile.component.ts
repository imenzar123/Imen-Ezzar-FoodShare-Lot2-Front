import {Component, OnInit} from '@angular/core';
import {UpdateProfileRequest} from '../../core/services/models/update-profile-request';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserControllerService} from '../../core/services/services/user-controller.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {AutheticationService} from '../../core/services/services/authetication.service';
import {RegistrationRequest} from '../../core/services/models/registration-request';
import {UserService} from '../../core/services/UserId/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {MissionResponse} from '../../core/services/models/mission-response';
import {UserProfileResponse} from '../../core/services/models/user-profile-response';

@Component({
  selector: 'app-update-user-profile',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './update-user-profile.component.html',
  standalone: true,
  styleUrl: './update-user-profile.component.css'
})
export class UpdateUserProfileComponent implements OnInit{
  updateForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  skills: string[] = ['COMMUNICATION', 'ORGANIZATION', 'IT', 'TEACHING', 'FIRST_AID', 'LOGISTICS', 'PSYCHOLOGICAL_SUPPORT', 'LEADERSHIP'];
  genders: string[] = ['MALE', 'FEMALE'];

  constructor(private fb: FormBuilder, private userService: UserControllerService,
              private userSer:UserService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

      dateOfBirth: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
    this.loadUserProfile();
  }

  get f() {
    return this.updateForm.controls;
  }
loadUserProfile(){

    this.userService.getMyProfile().subscribe({
      next: (res: UserProfileResponse) => {
        this.updateForm.patchValue({
          firstname: res.firstname,
          lastname: res.lastname,
          email: res.email,
          dateOfBirth: res.dateOfBirth,
          skill: res.skill,
          gender: res.gender,

        });
      },
      error: (err) => console.error(err)
    })
}
  onSubmit(): void {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    const updateProfileRequest: UpdateProfileRequest = this.updateForm.value as UpdateProfileRequest;

    this.userService.updateMyProfile({ body: updateProfileRequest }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'updated profile successful!',

          confirmButtonText: 'OK'
        });
        this.updateForm.reset();
        this.submitted = false;
        this.router.navigate(['/home/user-profile']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '❌ update failed',
          text: err.error?.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'Retry'
        });
      }
    });
  }
}
