import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  route = inject(ActivatedRoute);
  userId?: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id']);
  }
}
