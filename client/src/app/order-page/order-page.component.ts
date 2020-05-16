import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;

  isRoot: boolean;
  modal: IMaterialInstance;

  private _componentDestroy: Subject<any> = new Subject();

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this._componentDestroy))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order';
          this.cdr.detectChanges();
        }
      });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.clearSubscriptions();
  }

  complete(): void {
    this.modal.open();
  }

  cancelComplete(): void {
    this.modal.close();
  }

  confirmComplete(): void {
    this.modal.close();
  }

  private clearSubscriptions(): void {
    this._componentDestroy.next();
    this._componentDestroy.complete();
  }
}
