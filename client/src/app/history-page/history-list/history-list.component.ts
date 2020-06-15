import { Component, Input } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent {
  @Input() orders: IOrder[];
}
