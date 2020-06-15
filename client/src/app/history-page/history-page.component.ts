import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { IOrder } from '../shared/interfaces';

const STEP: number = 2; // Кол-во объектов данных для загрузки в одной запросе.

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tooltip') tooltipRef: ElementRef
  isFilterVisible: boolean = false;
  tooltip: IMaterialInstance;
  orders: IOrder[] = [];

  offset: number = 0;
  limit: number = STEP;

  initialOrdersLoading: boolean = false;
  moreOrdersLoading: boolean = false;
  noMoreOrders: boolean =  false;

  streamSub: Subscription;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.initialOrdersLoading = true;
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.clearSubscriptions();
  }

  onOpenFilterButtonClick(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  loadMore(): void {
    this.offset += STEP;
    this.moreOrdersLoading =  true;
    this.fetch();
  }

  private fetch(): void {
    const params = {
      offset: this.offset,
      limit: this.limit,
    };

    this.streamSub = this.ordersService.fetch(params).subscribe(
      (orders: IOrder[]) => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
      },
      () => {},
      () => {
        this.initialOrdersLoading = false;
        this.moreOrdersLoading = false;
      }
    );
  }

  private clearSubscriptions(): void {
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
  }
}
