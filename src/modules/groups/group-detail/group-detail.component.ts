import { Component } from '@angular/core';
import { Group } from '../../../entities/group';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css',
})
export class GroupDetailComponent {
  group!: Group;
}
