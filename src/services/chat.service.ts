import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Client, Subscription, over } from 'stompjs';
import { environement } from '../app/environments/environment.development';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = environement.webSocketUrl;
  private socket?: WebSocket;
  private stomp?: Client;
  private chatUserName = '';
  private msgSubscription?: Subscription;

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
          subscriber.complete();
        },
        (error) => {
          this.msgService.error('Server connection error');
          console.error('STOMP error', error);
          subscriber.next(false);
          subscriber.complete();
        }
      );
    });
  }

  sendName(name: string) {
    // this.stomp?.send('/app/hello', {}, `{'name': '${name}'}`);
    this.stomp?.send('/app/hello', {}, JSON.stringify(name));
    this.chatUserName = name;
  }

  sendMessage(message: string) {
    this.stomp?.send(
      '/app/message',
      {},
      JSON.stringify({ name: this.chatUserName, message })
    );
  }

  listenToMessages(): Observable<ChatMessage> {
    return new Observable((subscriber) => {
      const msgSubscription = this.stomp?.subscribe(
        '/topic/messages',
        (msg) => {
          subscriber.next(JSON.parse(msg.body) as ChatMessage);
        }
      );
      return {
        unsubscribe: () => {
          msgSubscription?.unsubscribe();
        },
      };
    });
  }

  listenToGreetings(): Observable<ChatMessage> {
    return new Observable((subscriber) => {
      const greetSubsc = this.stomp?.subscribe('/topic/greetings', (msg) => {
        let jsonObj = JSON.parse(msg.body) as { content: string };
        subscriber.next(new ChatMessage('Server', jsonObj.content));
      });
      return {
        unsubscribe: () => {
          greetSubsc?.unsubscribe();
        },
      };
    });
  }

  disconnect() {
    this.msgSubscription?.unsubscribe();
    this.stomp?.disconnect(() => {});
  }
}
export class ChatMessage {
  constructor(public name: string, public message: string) {}
}
