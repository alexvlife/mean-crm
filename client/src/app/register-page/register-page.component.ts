import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { IUser } from '../shared/interfaces';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }

  get isEmailControlValueError(): boolean {
    return this.form?.get('email').errors['email'];
  }

  get isPasswordControlValueError(): boolean {
    const minLengthError: ValidationErrors = this.form?.get('password').errors['minlength'];
    return Boolean(minLengthError && minLengthError['requiredLength']);
  }

  get isSubmitButtonDisabled(): boolean {
    return this.form.invalid || this.form.disabled;
  }

  isFormControlRequiredError(formControlName: string): boolean {
    return this.form?.get(formControlName)?.errors['required'];
  }

  isFormControlInvalid(formControlName: string): boolean {
    return this.form?.get(formControlName)?.invalid && this.form?.get(formControlName)?.touched;
  }

  onSubmit(): void {
    this.form.disable();

    this.authSubscription = this.authService.register((this.form.value as IUser)).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        });
      },
      error => {
        console.warn('Register error:', error);
        this.form.enable();
      },
    );
  }

  private initForm(): void {
    const PASSWORD_MIN_LENGTH: number = 6;

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)])
    });
  }

  private clearSubscriptions(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
