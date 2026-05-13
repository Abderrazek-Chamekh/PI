import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReservationRequest,
  ReservationResponse,
  PaiementRequest,
  QrCodeVolResponse
} from '../models/reservation.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly base = `${environment.apiBaseUrl}/api/reservations`;
  private readonly annulBase = `${environment.apiBaseUrl}/api/annulations`;
  private readonly qrBase = `${environment.apiBaseUrl}/api/qrcodes`;

  constructor(private http: HttpClient) {}

  creer(req: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(this.base, req);
  }

  mesReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.base}/mes-reservations`);
  }

  payer(req: PaiementRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.base}/payer`, req);
  }

  annuler(id: number): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.annulBase}/${id}`, {});
  }

  supprimerAvantPaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getQrCode(reservationId: number): Observable<QrCodeVolResponse> {
    return this.http.get<QrCodeVolResponse>(
      `${this.qrBase}/reservation/${reservationId}`
    );
  }

  getHotelRecommendations(destination: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/hotels/recommandations?destination=${destination}`);
  }

  getOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/offres`);
  }

  creerOffre(offre: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/api/offres`, offre);
  }
}