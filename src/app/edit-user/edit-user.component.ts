import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { map } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  route = inject(ActivatedRoute);
  userId?: number;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((params) => Number(params.get('id'))))
      .subscribe((id) => (this.userId = id));

    this.userId = Number(this.route.snapshot.params['id']);
  }
}
