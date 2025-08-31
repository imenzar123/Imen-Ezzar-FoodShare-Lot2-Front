import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {AutheticationService} from '../../../core/services/services/authetication.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './verify-email.component.html',
  standalone: true,
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
 public verifyForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,
              private authService: AutheticationService,
              private router: Router,
              ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  // raccourci pour accéder aux contrôles
  public get f() {
    return this.verifyForm.controls;
  }

  public onSubmit() {
    this.submitted = true;

    if (this.verifyForm.invalid) {
      return;
    }

    const code = this.verifyForm.value.code;

    this.authService.confirm({ token: code }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '✅ Compte activé',
          text: 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '❌ Erreur',
          text: err.error?.message || 'Code invalide ou expiré',
          confirmButtonText: 'Réessayer'
        });
      }
    });
  }
}
