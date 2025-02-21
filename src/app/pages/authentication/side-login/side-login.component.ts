import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  form = new FormGroup({
    dni: new FormControl('', [Validators.required, Validators.minLength(7)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const credentials = {
      dni: this.form.value.dni as string,
      password: this.form.value.password as string
    };
    this.authService.login(credentials)
      .subscribe(
        (response) => {
          localStorage.setItem('token', response.token); // Almacenar el token
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
          this._snackBar.open('Ha ocurrido un error. Vuelve a intentarlo más tarde.', 'Cerrar');
        }
      );
  }
}