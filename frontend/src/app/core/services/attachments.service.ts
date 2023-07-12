import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  constructor(private readonly http: HttpClient) {}

  getAttachment(id: string): Observable<AttachmentModel> {
    return this.http.get<AttachmentModel>(`${environment.api}/attachments/findOne/${id}`);
  }

  find(): Observable<AttachmentModel[]> {
    return this.http.get<AttachmentModel[]>(`${environment.api}/attachments/findAll`);
  }

  create(title: string, file: FormData): Observable<AttachmentModel> {
    return this.http.post<AttachmentModel>(`${environment.api}/attachments/create/${title}`, file);
  }

  update(id: string, title: string): Observable<AttachmentModel> {
    return this.http.patch<AttachmentModel>(
      `${environment.api}/attachments/update/${id}/${title}`,
      null
    );
  }

  remove(id: string): Observable<AttachmentModel> {
    return this.http.delete<AttachmentModel>(`${environment.api}/attachments/remove/${id}`);
  }
}
