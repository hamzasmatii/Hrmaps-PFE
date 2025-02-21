import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/Formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8085/api/formation';

  constructor(private http: HttpClient) {}

  addFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  getFormationById(formationId: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${formationId}`);
  }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  updateFormation(formationId: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${formationId}`, formation);
  }

  deleteFormation(formationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${formationId}`);
  }

  getFormationsByUserId(userId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/user/${userId}`);
  }

 
}