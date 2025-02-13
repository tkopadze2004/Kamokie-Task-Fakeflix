import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFormComponent } from '../../../shared/auth-form/auth-form.component';
import { passwordMatchValidator } from '../../../core/validators/password.validator';
import { RegisterPayload } from '../../../core/interfaces/auth.interface';
import { AuthFacade } from '../../../facades/auth.facade';
import { catchError, delay, Subject, takeUntil, tap, throwError } from 'rxjs';
import {
  registerButtons,
  registerFormFiels,
} from '../../../core/utils/auth.utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink, AuthFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authFacade = inject(AuthFacade);
  private sub$ = new Subject();
  private router = inject(Router);
  public errorMessage: string | null = null;
  public successMessagge: string | null = null;
  public registerForm!: FormGroup;
  private fb = inject(FormBuilder);
  public formFields = registerFormFiels;
  public buttons = registerButtons;


  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator,
      } as AbstractControlOptions
    );
  }

  public handleFormSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.successMessagge = null;

    const payload = this.registerForm.value as RegisterPayload as {
      name: string;
      email: string;
      password: string;
      currentPassword: string;
    };

    this.authFacade
      .register(payload)
      .pipe(
        takeUntil(this.sub$),
        catchError(({ error }) => {
          this.errorMessage = error.error.message;
          return throwError(() => error.error.message);
        }),
        tap(() => {
          this.successMessagge = 'Registration Successful!';
        }),
        delay(2000)
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }
}
