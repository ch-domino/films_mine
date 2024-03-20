import {
  AfterViewInit,
  Component,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Film } from '../../entities/film';
import { FilmsService } from '../../services/films.service';
import { UsersService } from '../../services/users.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css',
})
export class FilmsComponent implements AfterViewInit {
  filmsService = inject(FilmsService);
  usersService = inject(UsersService);
  userNameS = this.usersService.loggedUserSignal;

  films: Film[] = [];
  columnsToDisplay = computed(() =>
    this.userNameS()
      ? ['id', 'nazov', 'rok', 'slovenskyNazov', 'afi1998', 'afi2007']
      : ['id', 'nazov', 'rok']
  );

  ngAfterViewInit(): void {
    this.filmsService.getFilms().subscribe((filmsResponse) => {
      console.log(filmsResponse);
      this.films = filmsResponse.items;
    });
  }
}
