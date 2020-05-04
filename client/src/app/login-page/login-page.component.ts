import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  get isEmailControlValueError(): boolean {
    return this.form?.get('email').errors['email'];
  }

  get isPasswordControlValueError(): boolean {
    const minLengthError: ValidationErrors = this.form?.get('password').errors['minlength'];
    return Boolean(minLengthError && minLengthError['requiredLength']);
  }

  isFormControlRequiredError(formControlName: string): boolean {
    return this.form?.get(formControlName)?.errors['required'];
  }

  isFormControlInvalid(formControlName: string): boolean {
    return this.form?.get(formControlName)?.invalid && this.form?.get(formControlName)?.touched;
  }

  onSubmit(): void {
    // TODO: write logic
  }

  private initForm(): void {
    const PASSWORD_MIN_LENGTH: number = 6;

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)])
    });
  }
}
