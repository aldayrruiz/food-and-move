import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackModel } from '@core/models/feedback/feedback.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private readonly http: HttpClient) {}

  getFeedbackByDay(patientId: string, createdAt: string): Observable<FeedbackModel> {
    const options = { params: { createdAt: createdAt.slice(0, 10) } };
    return this.http.get<FeedbackModel>(
      `${environment.api}/feedback/byPatientAndDay/${patientId}`,
      options
    );
  }

  getFeedbackByRange(patientId: string, start: string, end: string) {
    const options = { params: { start, end } };
    return this.http.get<FeedbackModel[]>(
      `${environment.api}/feedback/byPatientAndRange/${patientId}`,
      options
    );
  }
}
