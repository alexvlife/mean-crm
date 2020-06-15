import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { IOrder, IOrderPosition } from 'src/app/shared/interfaces';
import { IMaterialInstance, MaterialService } from 'src/app/shared/services/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;
  @Input() orders: IOrder[];

  selectedOrder: IOrder;
  modal: IMaterialInstance;

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  computePrice(order: IOrder): number {
    return order.list.reduce((total: number, item: IOrderPosition) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  selectOrder(order): void {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal(): void {
    this.modal.close();
  }
}
