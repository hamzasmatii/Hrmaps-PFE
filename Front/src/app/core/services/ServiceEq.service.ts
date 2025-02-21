import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEq } from '../models/ServiceEq';

@Injectable({
  providedIn: 'root'
})
export class ServiceEqService {
  private apiUrl = 'http://localhost:8085/api/serviceEq';

  constructor(private http: HttpClient) {}

  addServiceEq(serviceEq: ServiceEq): Observable<ServiceEq> {
    return this.http.post<ServiceEq>(this.apiUrl, serviceEq);
  }

  getServiceEqById(serviceEqId: number): Observable<ServiceEq> {
    return this.http.get<ServiceEq>(`${this.apiUrl}/${serviceEqId}`);
  }

  getAllServiceEqs(): Observable<ServiceEq[]> {
    return this.http.get<ServiceEq[]>(this.apiUrl);
  }

  updateServiceEq(serviceEqId: number, serviceEq: ServiceEq): Observable<ServiceEq> {
    return this.http.put<ServiceEq>(`${this.apiUrl}/${serviceEqId}`, serviceEq);
  }

  deleteServiceEq(serviceEqId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${serviceEqId}`);
  }

  getServiceEqByUserId(userId: number): Observable<ServiceEq> {
    return this.http.get<ServiceEq>(`${this.apiUrl}/user/${userId}`);
  }
  
  getServiceEqByChefId(userId: number): Observable<ServiceEq> {
    return this.http.get<ServiceEq>(`${this.apiUrl}/chef/${userId}`);
  }
}
