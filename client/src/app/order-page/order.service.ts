import { Injectable } from '@angular/core';
import { IOrderPosition, IPosition } from '../shared/interfaces';
import { convertPositionToOrderPosition } from './order.utils';

@Injectable()
export class OrderService {
  list: IOrderPosition[] = [];
  totalPrice: number = 0;

  add(position: IPosition): void {
    const orderPosition: IOrderPosition = convertPositionToOrderPosition(position);
    const candidate: IOrderPosition = this.list.find((p: IOrderPosition) => p._id === orderPosition._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.updateTotalPriceAfterAdd(orderPosition);
  }

  remove(orderPosition: IOrderPosition): void {
    const deletedOrderPositionIndex: number = this.list.findIndex((p: IOrderPosition) => p._id === orderPosition._id);
    this.list.splice(deletedOrderPositionIndex, 1)
    this.updateTotalPriceAfterRemove(orderPosition);
  }

  clear(): void {
    this.list = [];
    this.totalPrice = 0;
  }

  updateTotalPriceAfterAdd(orderPosition: IOrderPosition): void {
    this.totalPrice += orderPosition.cost * orderPosition.quantity;
  }

  updateTotalPriceAfterRemove(orderPosition: IOrderPosition): void {
    this.totalPrice -= orderPosition.cost * orderPosition.quantity;
  }
}
