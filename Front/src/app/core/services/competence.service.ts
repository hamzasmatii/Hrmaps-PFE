import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competence } from '../models/Competence';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private apiUrl = 'http://localhost:8085/api/competence';

  constructor(private http: HttpClient) {}

  addCompetence(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, competence);
  }

  getCompetenceById(competenceId: number): Observable<Competence> {
    return this.http.get<Competence>(`${this.apiUrl}/${competenceId}`);
  }

  getAllCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl);
  }

  updateCompetence(competenceId: number, competence: Competence): Observable<Competence> {
    return this.http.put<Competence>(`${this.apiUrl}/${competenceId}`, competence);
  }

  deleteCompetence(competenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${competenceId}`);
  }

  getCompetencesByJobPositionId(jobPositionId: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/by-poste/${jobPositionId}`);
  }
}
