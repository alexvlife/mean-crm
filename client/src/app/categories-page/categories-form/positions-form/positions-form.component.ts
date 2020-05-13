import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMaterialInstance, MaterialService } from '../../../shared/services/material.service';
import { PositionsService } from '../../../shared/services/positions.service';
import { IPosition, IResponseMessage } from '../../../shared/interfaces';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: IPosition[] = [];
  loading: boolean = false;
  positionId: string = null;
  modal: IMaterialInstance;
  form: FormGroup;

  private _componentDestroy: Subject<any> = new Subject();

  constructor(
    private cdr: ChangeDetectorRef,
    private positionsService: PositionsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllPositions();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.clearSubscriptions();
  }

  get isCancelButtonDisabled(): boolean {
    return this.form?.disabled;
  }

  get isSubmitButtonDisabled(): boolean {
    return this.form?.invalid || this.form?.disabled;
  }

  get isCostControlValueError(): boolean {
    return this.form?.get('cost').errors['min'];
  }

  isFormControlRequiredError(formControlName: string): boolean {
    return this.form?.get(formControlName)?.errors['required'];
  }

  isFormControlInvalid(formControlName: string): boolean {
    return this.form?.get(formControlName)?.invalid && this.form?.get(formControlName)?.touched;
  }

  onSelectPosition(position: IPosition): void {
    this.positionId = position._id;

    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });

    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition(): void {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(evt: Event, position: IPosition): void {
    evt.stopPropagation();

    const decision: boolean = window.confirm(`Удалить позицию ${position.name}?`);

    if (decision) {
      this.positionsService.delete(position)
        .pipe(takeUntil(this._componentDestroy))
        .subscribe(
          (response: IResponseMessage) => {
            const deletedPositionIndex: number = this.positions.findIndex((p: IPosition) => p._id === position._id);
            this.positions.splice(deletedPositionIndex, 1);
            this.cdr.detectChanges();
            MaterialService.toast(response?.message || `Позиция ${position.name} удалена`);
          },
          error => MaterialService.toast(error?.error?.message || 'Ошибка при удалении позиции'),
        );
    }
  }

  onCancel(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.form.disable();

    const newPosition: IPosition = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;

      this.positionsService.update(newPosition)
        .pipe(takeUntil(this._componentDestroy))
        .subscribe(
          (position: IPosition) => {
            const updatedPositionIndex: number = this.positions.findIndex((p: IPosition) => p._id === position._id);
            this.positions[updatedPositionIndex] = position;
            this.cdr.detectChanges();
            MaterialService.toast('Изменения сохранены');
          },
          error => MaterialService.toast(error?.error?.message || 'Ошибка при изменении позиции'),
          completed,
        );
    } else {
      this.positionsService.create(newPosition)
        .pipe(takeUntil(this._componentDestroy))
        .subscribe(
          (position: IPosition) => {
            MaterialService.toast('Позиция создана');
            this.positions.push(position);
            this.cdr.detectChanges();
          },
          error => MaterialService.toast(error?.error?.message || 'Ошибка при создании позиции'),
          completed
        );
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  private getAllPositions(): void {
    this.loading = true;

    this.positionsService.fetch(this.categoryId)
      .pipe(takeUntil(this._componentDestroy))
      .subscribe(
        (positions: IPosition[]) => {
          this.loading = false;
          this.positions = positions;
          this.cdr.detectChanges();
        },
        error => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      );
  }

  private clearSubscriptions(): void {
    this._componentDestroy.next();
    this._componentDestroy.complete();
  }
}
