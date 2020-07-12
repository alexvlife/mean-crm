import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsService } from '../shared/services/analytics.service';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';
import { IOverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef: ElementRef;

  tapTarget: IMaterialInstance;
  data$: Observable<IOverviewPage>;

  yesterday: Date = new Date;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.data$ = this.analyticsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  openInfo(): void {
    this.tapTarget.open();
  }
}
