import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/services/material.service';
import { ICategory, IResponseMessage } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  @ViewChild('input') inputRef: ElementRef;

  isNew: boolean = true;
  form: FormGroup;
  image: File;
  imagePreview: string | ArrayBuffer | null = '';

  existCategory: ICategory;

  private _streamsSubscription: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
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

  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  deleteCategory(): void {
    const decision: boolean = window.confirm(`Вы уверены, что хотите удалить категорию "${this.existCategory.name}"?`);

    if (decision) {
      this.categoriesService.delete(this.existCategory._id).subscribe(
        (response: IResponseMessage) => MaterialService.toast(response?.message || ''),
        error => MaterialService.toast(error?.error?.message || 'Ошибка при удалении категории'),
        () => this.router.navigate(['/categories'])
      );
    }
  }

  onFileUpload(evt: any): void {
    const file = evt.target.files[0];
    this.image = file;

    // For show image preview
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.form.disable();

    const stream$: Observable<ICategory> = this.isNew
      ? this.categoriesService.create(this.form.value.name, this.image)
      : this.categoriesService.update(this.existCategory._id, this.form.value.name, this.image);

    const streamSubscription: Subscription = stream$.subscribe(
      (category: ICategory) => {
        const successMessage: string = this.isNew ? 'Создана новая категория' : 'Изменения сохранены';
        this.existCategory = category;
        MaterialService.toast(successMessage);
        this.form.enable();
      },
      error => {
        const action: string = this.isNew ? 'создании' : 'изменении';
        MaterialService.toast(error?.error?.message || `Ошибка при ${action} категории`);
        this.form.enable();
      }
    );

    this._streamsSubscription.add(streamSubscription);
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });

    this.form.disable();
  }

  private subscribeToRouteParams(): void {
    this._streamsSubscription = this.route.params.pipe(
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
          this.existCategory = category;
          this.form.patchValue({
            name: category.name
          });

          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }

        this.form.enable();
      },
      error => MaterialService.toast(error?.error?.message || 'Ошибка при получении категории')
    );
  }

  private clearSubscription(): void {
    if (this._streamsSubscription) {
      this._streamsSubscription.unsubscribe();
      this._streamsSubscription = null;
    }
  }
}
