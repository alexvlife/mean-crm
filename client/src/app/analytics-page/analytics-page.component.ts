import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../shared/services/analytics.service';
import { IAnalyticsPage, IAnalyticsChartItem } from '../shared/interfaces';
import { Chart } from 'chart.js';

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
      this.drawGainGraph(data);
      this.drawOrderGraph(data);
      this.pending = false;
    });
  }

  ngOnDestroy(): void {
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
  }

  private drawGainGraph(data: IAnalyticsPage): void {
    // Конфиг для графика
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)',
    };

    gainConfig.labels = data.chart.map((item: IAnalyticsChartItem) => item.label); // Получаем массив данных для оси X
    gainConfig.data = data.chart.map((item: IAnalyticsChartItem) => item.gain);

    // **** Gain - mock data ****
    // gainConfig.labels.push('17.05.2020');
    // gainConfig.data.push(1500);
    // gainConfig.labels.push('20.05.2020');
    // gainConfig.data.push(9500);
    // **** /Gain - mock data ****

    const gainCtx = this.gainRef.nativeElement.getContext('2d');
    gainCtx.canvas.height = '300px';

    new Chart(gainCtx, createChartConfig(gainConfig));
  }

  private drawOrderGraph(data: IAnalyticsPage): void {
    // Конфиг для графика
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)',
    };

    orderConfig.labels = data.chart.map((item: IAnalyticsChartItem) => item.label); // Получаем массив данных для оси X
    orderConfig.data = data.chart.map((item: IAnalyticsChartItem) => item.order);

    // **** Order - mock data ****
    // orderConfig.labels.push('17.05.2020');
    // orderConfig.data.push(3);
    // orderConfig.labels.push('20.05.2020');
    // orderConfig.data.push(10);
    // **** /Order - mock data ****

    const orderCtx = this.orderRef.nativeElement.getContext('2d');
    orderCtx.canvas.height = '300px';

    new Chart(orderCtx, createChartConfig(orderConfig));
  }
}

/**
 * На основе нашей кастомной конфигурации (см. gainConfig)
 * генерирует общую конфигурацию для графика (который будет отрисован)
 */
function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        }
      ]
    }
  };
}
