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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required, Validators.minLength(7)]),
    cargo: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const newUser = {
        nombre: this.form.value.nombre as string,
        apellido: this.form.value.apellido as string,
        dni: this.form.value.dni as string,
        cargo: this.form.value.cargo as string,
        password: this.form.value.password as string,
      };

      this.authService.register(newUser).subscribe(
        (response) => {
          console.log('Registro exitoso:', response);
          this._snackBar.open('Registro exitoso. Por favor, inicia sesión.', 'Cerrar', { duration: 5000 });
          this.router.navigate(['/authentication/login']);
        },
        (error) => {
          console.error('Error en el registro:', error);
          if (error.error === 'El DNI ya está registrado') {
            this._snackBar.open('El DNI ya está registrado.', 'Cerrar', { duration: 5000 });
          } else {
            this._snackBar.open('Error al registrarse. Por favor, inténtalo de nuevo.', 'Cerrar', { duration: 5000 });
          }
        }
      );
    }
  }
}