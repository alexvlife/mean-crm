import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/services/material.service';
import { IUser } from '../shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  authSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToRouteQueryParams();
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

    this.authSubscription = this.authService.login((this.form.value as IUser)).subscribe(
      () => {
        // TODO: create route /overview

        // this.router.navigate(['/overview']);
      },
      error => {
        MaterialService.toast(error?.error?.message || 'Error by login.');
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

  private subscribeToRouteQueryParams(): void {
    this.routeSubscription = this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can logIn, using your data.');
      } else if (params['accessDenied']) {
        MaterialService.toast('First you need to register.');
      }
    });
  }

  private clearSubscriptions(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
