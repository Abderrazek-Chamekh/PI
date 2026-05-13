// src/app/services/events/payment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EventPayment,
  EventPaymentRequest,
} from '../../event/models/event.model';

export interface StripeCheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  reservationId: number;
  paymentId: number;
}

export interface StripeCheckoutSessionRequest {
  reservationId: number;
  promoCode?: string | null;
}

export interface StripeConfirmRequest {
  reservationId: number;
  sessionId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/payments/events`;
  constructor(private readonly http: HttpClient) {}

  create(payload: EventPaymentRequest): Observable<EventPayment> {
    return this.http.post<EventPayment>(this.apiUrl, payload);
  }

  success(id: number): Observable<EventPayment> {
    return this.http.put<EventPayment>(`${this.apiUrl}/${id}/success`, {});
  }

  createStripeSession(payload: StripeCheckoutSessionRequest): Observable<StripeCheckoutSessionResponse> {
    return this.http.post<StripeCheckoutSessionResponse>(`${this.apiUrl}/stripe/session`, payload);
  }

  confirmStripeSession(payload: StripeConfirmRequest): Observable<EventPayment> {
    return this.http.post<EventPayment>(`${this.apiUrl}/stripe/confirm`, payload);
  }
}
