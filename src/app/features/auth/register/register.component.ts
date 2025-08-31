import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AutheticationService} from '../../../core/services/services/authetication.service';
import {RegistrationRequest} from '../../../core/services/models/registration-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink,
    NgForOf
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  skills: string[] = ['COMMUNICATION', 'ORGANIZATION', 'IT', 'TEACHING', 'FIRST_AID', 'LOGISTICS', 'PSYCHOLOGICAL_SUPPORT', 'LEADERSHIP'];
  genders: string[] = ['MALE', 'FEMALE'];

  constructor(private fb: FormBuilder, private authService: AutheticationService,
              private router: Router
              ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dateOfBirth: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const registerRequest: RegistrationRequest = this.registerForm.value as RegistrationRequest;

    this.authService.registerUser({ body: registerRequest }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '✅ Registration successful!',
          text: 'Please check your email to activate your account.',
          confirmButtonText: 'OK'
        });
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['/verify-email']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '❌ Registration failed',
          text: err.error?.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'Retry'
        });
      }
    });
  }

}
