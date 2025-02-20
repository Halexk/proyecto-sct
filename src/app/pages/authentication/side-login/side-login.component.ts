import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { User, Credentials } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar

  ) { }

  credentials: Credentials;

  form = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(7)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  asubmit() {
    // console.log(this.form.value);
    this.router.navigate(['/']);
  }
  submit() {
    this.credentials = {
      id: this.form.value.id as string,
      password:this.form.value.password as string
    };
    this.authService.login(this.credentials)
      .subscribe(
        (response) => {
          console.log(response)
          localStorage.setItem('token', response.token); // Store the token
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
          this._snackBar.open('Ha ocurrido un error vuelve a intentarlo mas tarde', 'Cerrar');
        }
      );
  }
}
