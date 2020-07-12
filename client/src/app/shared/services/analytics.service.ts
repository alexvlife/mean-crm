import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAnalyticsPage, IOverviewPage } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<IOverviewPage> {
    return this.http.get<IOverviewPage>('api/analytics/overview');
  }

  getAnalytics(): Observable<IAnalyticsPage> {
    return this.http.get<IAnalyticsPage>('api/analytics/analytics');
  }
}
