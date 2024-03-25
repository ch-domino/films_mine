import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Client, over } from 'stompjs';
import { environement } from '../app/environments/environment.development';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = environement.webSocketUrl;
  private socket?: WebSocket;
  private stomp?: Client;

  constructor(private msgService: MessageService) {}

  connect(): Observable<boolean> {
    this.socket = new WebSocket(this.url);
    this.stomp = over(this.socket);
    return new Observable((subscriber: Subscriber<boolean>) => {
      this.stomp!.connect(
        {},
        (frame) => {
          this.msgService.success('Connected to chat server');
          subscriber.next(true);
        },
        (error) => {
          this.msgService.error('Cannot connect to chat server');
          console.error('STOMP error', error);
          subscriber.next(false);
        }
      );
    });
  }
}
