import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { MaterialModule } from '../../modules/material.module';
import { ChatMessage, ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  name = '';
  chatService = inject(ChatService);
  messages: ChatMessage[] = [];
  msgToSend = '';
  msgSubscription?: Subscription;
  greetingSubscription?: Subscription;

  connect() {
    this.chatService
      .connect()
      .pipe(
        tap((ok) => {
          if (ok) {
            this.listenToEndpoints();
            this.chatService.sendName(this.name);
          }
        })
      )
      .subscribe((ok) => {
        console.log('Connected!');
      });
  }

  listenToEndpoints() {
    this.msgSubscription = this.chatService
      .listenToMessages()
      .subscribe((message) => {
        this.messages = [...this.messages, message];
      });
    this.greetingSubscription = this.chatService
      .listenToGreetings()
      .subscribe((message) => {
        this.messages = [...this.messages, message];
      });
  }

  sendMessage() {
    this.chatService.sendMessage(this.msgToSend);
  }

  disconnect() {
    this.msgSubscription?.unsubscribe();
    this.greetingSubscription?.unsubscribe();
    console.log('Disconnecting...');
    this.chatService.disconnect();
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
