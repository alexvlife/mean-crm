import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../shared/services/analytics.service';
import { IAnalyticsPage } from '../shared/interfaces';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending: boolean = true;

  streamSub: Subscription;

  constructor(private analyticsService: AnalyticsService) {}

  ngAfterViewInit(): void {
    this.streamSub = this.analyticsService.getAnalytics().subscribe((data: IAnalyticsPage) => {
      this.average = data.average;
      this.pending = false;
    });
  }

  ngOnDestroy(): void {
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
  }
}
