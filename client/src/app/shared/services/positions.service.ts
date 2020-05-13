import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPosition, IResponseMessage } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient) { }

  fetch(categoryId: string): Observable<IPosition[]> {
    return this.http.get<IPosition[]>(`/api/position/${categoryId}`);
  }

  create(position: IPosition): Observable<IPosition> {
    return this.http.post<IPosition>(`/api/position/`, position);
  }

  update(position: IPosition): Observable<IPosition> {
    return this.http.patch<IPosition>(`/api/position/${position._id}`, position);
  }

  delete(position: IPosition): Observable<IResponseMessage> {
    return this.http.delete<IResponseMessage>(`/api/position/${position._id}`);
  }
}
