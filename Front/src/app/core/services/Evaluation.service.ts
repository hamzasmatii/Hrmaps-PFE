import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../models/Evaluation';
import { EvaluationType } from '../models/EvaluationType';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8085/api/evaluation';

  constructor(private http: HttpClient) {}

  addEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  getEvaluationById(evaluationId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${evaluationId}`);
  }

  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  updateEvaluation(evaluationId: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${evaluationId}`, evaluation);
  }

  deleteEvaluation(evaluationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${evaluationId}`);
  }

  findEvaluationsUserbyType(userId: number, compId: number, evalu: EvaluationType): Observable<Evaluation[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('compId', compId.toString())
      .set('eval', evalu);

    return new Observable<Evaluation[]>(observer => {
      this.http.get<Evaluation[]>(`${this.apiUrl}/find-user-competence`, { params })
        .subscribe({
          next: (data) => observer.next(data),
          error: (err: HttpErrorResponse) => {
            console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
            observer.error('Something went wrong; please try again later.');
          },
          complete: () => observer.complete()
        });
    });
  }

  findallEvaluationsUserandcompet(userId: number, compId: number): Observable<Evaluation[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('compId', compId.toString());

    return new Observable<Evaluation[]>(observer => {
      this.http.get<Evaluation[]>(`${this.apiUrl}/find-user-allcompetence`, { params })
        .subscribe({
          next: (data) => observer.next(data),
          error: (err: HttpErrorResponse) => {
            console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
            observer.error('Something went wrong; please try again later.');
          },
          complete: () => observer.complete()
        });
    });
  }

  deleteEvaluationsByUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-by-user/${userId}`);
  }

  getEvaluationsByUserIdAndCompetenceIdwithoutForUser(userId: number, compId: number): Observable<Evaluation[]> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('competenceId', compId.toString());

    return new Observable<Evaluation[]>(observer => {
      this.http.get<Evaluation[]>(`${this.apiUrl}/find-user-allcompetence-withouforuser`, { params })
        .subscribe({
          next: (data) => observer.next(data),
          error: (err: HttpErrorResponse) => {
            console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
            observer.error('Something went wrong; please try again later.');
          },
          complete: () => observer.complete()
        });
    });
  }

  calculateAndAssignAverageNote(userId: number, competenceId: number): Observable<number> {
    const params = new HttpParams()
    .set('userId', userId.toString())
    .set('competenceId', competenceId.toString());

   return this.http.post<number>(`${this.apiUrl}/calculate-note-competence`, null, { params });
    
  }



}
