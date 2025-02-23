// src/app/components/error-messages/error-messages.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-error-messages',
    standalone: true,
    template: `
<div class="error-messages" *ngIf="control?.invalid && control?.touched">
    <div class="text-error" *ngIf="control?.errors?.required">
        Este campo es requerido
    </div>
    <div class="text-error" *ngIf="control?.errors?.whitespace">
        No se permiten espacios en blanco
    </div>
    <div class="text-error" *ngIf="control?.errors?.maxlength">
        Supera la longitud máxima permitida
    </div>
    <div class="text-error" *ngIf="control?.errors?.minlength">
        No alcanza la longitud mínima requerida
    </div>
    <div class="text-error" *ngIf="control?.errors?.['pattern']">
        Por favor, ingresa un formato de correo electrónico válido
    </div>
    <div class="text-error" *ngIf="control?.errors?.['pattern'] && control?.errors?.['pattern'].requiredPattern">
        El formato requerido es: {{ control?.errors?.['pattern'].requiredPattern }}
    </div>
    <div class="text-error" *ngIf="control?.errors?.['min']">
        El valor mínimo es {{control?.errors?.['min']?.['min']}}
    </div>
    <div class="text-error" *ngIf="control?.errors?.['max']">
        El valor máximo es {{control?.errors?.['max']?.['max']}}
    </div>
</div>
    `,
})
export class ErrorMessagesComponent {
    @Input() control: AbstractControl | null;
}