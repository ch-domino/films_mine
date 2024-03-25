import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { ChatService } from '../../services/chat.service';

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

  connect() {
    this.chatService.connect().subscribe((ok) => {
      console.log('Connected!');
    });
  }
  disconnect() {}
}
