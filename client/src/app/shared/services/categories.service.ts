import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  fetch(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/api/category');
  }

  getById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`/api/category/${id}`);
  }
}
