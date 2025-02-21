import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { ServiceEq } from '../models/ServiceEq';
import { JobPosition } from '../models/JobPosition';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRole: string;
  private idUser:number;

  private apiUrl = 'http://localhost:8085/api/user';

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUser(userId: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
  

  login(matriculeP: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      identifiantUser: matriculeP,
      mdp: password
    }).pipe(
      map(response => {
        if (response.message === 'Login successful') {
          this.userRole = response.role;
          this.idUser = response.id;
          return true;
        } else {
          return false;
        }
      })
    );
  }
  logout(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/logout`).pipe(
      map(() => {
        this.userRole = null;
      })
    );
  }

  getRole(): string {
    return this.userRole;
  }

  getIduser(): number {
    return this.idUser;
  }

  isAuthenticated(): boolean {
    return !!this.userRole;
  }

  getServiceEqByUserId(userId: number): Observable<ServiceEq> {
    return this.http.get<ServiceEq>(`${this.apiUrl}/service/${userId}`);
  }

  getChefsWithoutService(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/chefs-without-service`);
  }

  getUsersWithoutService(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/without-service`);
  }

  findUsersByServiceEqId(eqId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/liste-users-service/${eqId}`);
  }

  getJobPositionForUser(userId: number): Observable<JobPosition> {
    return this.http.get<JobPosition>(`${this.apiUrl}/job-position/${userId}`);
  }

  getUsersByFormation(formationId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/by-formation/${formationId}`);
  }

  


}
