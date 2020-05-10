import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory, IResponseMessage } from '../interfaces';

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

  create(name: string, image?: File): Observable<ICategory> {
    const data: FormData = this.generateDataForCreateAndUpdateRequest(name, image);
    return this.http.post<ICategory>('/api/category', data);
  }

  update(id: string, name: string, image?: File): Observable<ICategory> {
    const data: FormData = this.generateDataForCreateAndUpdateRequest(name, image);
    return this.http.patch<ICategory>(`/api/category/${id}`, data);
  }

  delete(id: string): Observable<IResponseMessage> {
    return this.http.delete<IResponseMessage>(`/api/category/${id}`);
  }

  private generateDataForCreateAndUpdateRequest(name: string, image?: File): FormData {
    const data: FormData = new FormData();
    data.append('name', name);

    if (image) {
      data.append('image', image, image.name);
    }

    return data;
  }
}
