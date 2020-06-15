import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tooltip') tooltipRef: ElementRef
  public isFilterVisible: boolean = false;
  public tooltip: IMaterialInstance;

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
  }

  public onOpenFilterButtonClick(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
}
