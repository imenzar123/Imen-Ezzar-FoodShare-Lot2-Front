import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AutheticationService} from '../../../core/services/services/authetication.service';
import {AuthenticationRequest} from '../../../core/services/models/authentication-request';
import {TokenService} from '../../../core/services/TokenService/token.service';
import {UserService} from '../../../core/services/UserId/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  public  loginForm: FormGroup;
  public  submitted = false;
  authRequest: AuthenticationRequest = {email: '', password: ''};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AutheticationService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {


  }
  public   get f() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    console.log('✅ Login data:', this.loginForm.value);
    this.authRequest.email = this.loginForm.get('email')?.value;
    this.authRequest.password = this.loginForm.get('password')?.value;

    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        if (res.id != null) {
          this.userService.userId = res.id;
        }

        console.log('Token:', this.tokenService.token);
        console.log('User Roles:', this.tokenService.userRoles);
        console.log('User ID:', this.userService.userId);


        this.redirectBasedOnRole();

        this.loginForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: '❌ Login failed',
          text: err.error?.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'Retry'
        });
      }
    });
  }
  private redirectBasedOnRole() {
    const roles = this.tokenService.userRoles;

    if (roles.includes('ADMIN')) {
      this.router.navigate(['/home/show-mission']);
      Swal.fire({
        icon: 'success',
        title: 'Bienvenue Admin!',
        text: 'Vous êtes connecté en tant qu\'administrateur',
        timer: 2000,
        showConfirmButton: false
      });
    }
    else if (roles.includes('USER')) {
      this.router.navigate(['/home/invitation-user-mission']);
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie!',
        text: 'Bienvenue sur votre espace utilisateur',
        timer: 2000,
        showConfirmButton: false
      });
    }

    else {

      this.router.navigate(['']);
      Swal.fire({
        icon: 'warning',
        title: 'Rôle non reconnu',
        text: 'Vous avez été redirigé vers la page d\'accueil',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  ngOnInit(): void {

    if (this.tokenService.isTokenValid()) {
      this.redirectBasedOnRole();
    }
  }
}
