import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { IMaterialDatepicker, MaterialService } from '../../shared/services/material.service';
import { IHistoryFilter } from '../../shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dateStart') dateStartRef: ElementRef;
  @ViewChild('dateEnd') dateEndRef: ElementRef;
  @Output() filter: EventEmitter<IHistoryFilter> = new EventEmitter<IHistoryFilter>();

  start: IMaterialDatepicker;
  end: IMaterialDatepicker;
  order: number;

  isValid: boolean = true;

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.dateStartRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.dateEndRef, this.validate.bind(this));
  }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  submitFilter(): void {
    const filter: IHistoryFilter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.filter.emit(filter);
  }

  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }
}
