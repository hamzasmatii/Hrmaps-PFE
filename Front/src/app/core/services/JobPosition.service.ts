import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPosition } from '../models/JobPosition';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class JobPositionService {
  private apiUrl = 'http://localhost:8085/api/jobposition';

  constructor(private http: HttpClient) {}

  addJobPosition(jobPosition: JobPosition): Observable<JobPosition> {
    return this.http.post<JobPosition>(this.apiUrl, jobPosition);
  }

  getJobPositionById(jobPositionId: number): Observable<JobPosition> {
    return this.http.get<JobPosition>(`${this.apiUrl}/${jobPositionId}`);
  }

  getAllJobPositions(): Observable<JobPosition[]> {
    return this.http.get<JobPosition[]>(this.apiUrl);
  }

  updateJobPosition(jobPositionId: number, jobPosition: JobPosition): Observable<JobPosition> {
    return this.http.put<JobPosition>(`${this.apiUrl}/${jobPositionId}`, jobPosition);
  }

  deleteJobPosition(jobPositionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${jobPositionId}`);
  }

 
  getUsersForJobPosition(id: number): Observable<User[]> {
    return this.http.post<User[]>(`http://localhost:8085/api/jobposition/users/${id}`,null);
    
  }

}
