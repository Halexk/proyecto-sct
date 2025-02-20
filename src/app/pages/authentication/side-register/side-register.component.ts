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
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {


  newUser: User;



  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  form = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(7)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() { 
    this.newUser = {
      id: this.form.value.id as string,
      email: this.form.value.email as string,
      password:this.form.value.password as string
    };
    this.authService.register(this.newUser)
      .subscribe(
        (response) => {
          console.log('Registration successful:', response); 
          this.router.navigate(['/authentication/login']);
        },
        (error) => {
          console.error('Registration failed:', error);
            // Manejar errores
             if (error.error === 'Duplicate ID or email') {
             this._snackBar.open('El CI o el correo electrónico ya están en uso.', 'Cerrar');
              } else {
              this._snackBar.open('Error al registrarse. Por favor, inténtalo de nuevo.', 'Cerrar');
             }
      
        }
      );
  }
}
