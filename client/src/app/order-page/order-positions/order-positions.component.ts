import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PositionsService } from '../../shared/services/positions.service';
import { IPosition } from '../../shared/interfaces';

const POSITION_QUANTITY_DEFAULT: number = 1;

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<IPosition[]>

  constructor(private route: ActivatedRoute, private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.getPositions();
  }

  addToOrder(position: IPosition): void {
    // TODO: add logic
  }

  private getPositions(): void {
    this.positions$ = this.route.params.pipe(
      switchMap((params: Params): Observable<IPosition[]> => this.positionsService.fetch(params['id'])),
      map((positions: IPosition[]): IPosition[] => {
        return positions.map((position: IPosition) => {
          position.quantity = POSITION_QUANTITY_DEFAULT;
          return position;
        });
      })
    );
  }
}
