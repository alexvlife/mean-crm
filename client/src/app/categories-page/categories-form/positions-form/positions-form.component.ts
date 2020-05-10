import { Component, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { IMaterialInstance, MaterialService } from '../../../shared/services/material.service';
import { PositionsService } from '../../../shared/services/positions.service';
import { IPosition } from '../../../shared/interfaces';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: IPosition[] = [];
  loading: boolean = false;
  modal: IMaterialInstance;

  constructor(private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(
      (positions: IPosition[]) => {
        this.loading = false;
        this.positions = positions;
      },
      error => {
        this.loading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: IPosition): void {
    this.modal.open();
  }

  onAddPosition(): void {
    this.modal.open();
  }

  onCancel(): void {
    this.modal.close();
  }
}
