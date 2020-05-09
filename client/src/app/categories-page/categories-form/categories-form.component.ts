import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/services/material.service';
import { ICategory } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isNew: boolean = true;

  private _routeParamsSubscription: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  get title(): string {
    const actionText: string = this.isNew ? 'Добавить' : 'Редактировать';
    return `${actionText} категорию`;
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    this.clearSubscription();
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

  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });

    this.form.disable();
  }

  private subscribeToRouteParams(): void {
    this._routeParamsSubscription = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          const categoryId: string = params['id'];

          if (categoryId) {
            // editing form
            this.isNew = false;
            return this.categoriesService.getById(categoryId);
          }

          return of(null);
        }
      )
    ).subscribe(
      (category: ICategory) => {
        if (category) {
          this.form.patchValue({
            name: category.name
          });
          MaterialService.updateTextInputs();
        }

        this.form.enable();
      },
      error => MaterialService.toast(error?.error?.message)
    );
  }

  private clearSubscription(): void {
    if (this._routeParamsSubscription) {
      this._routeParamsSubscription.unsubscribe();
    }
  }
}
