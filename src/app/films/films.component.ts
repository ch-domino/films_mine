import {
  AfterViewInit,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap, tap } from 'rxjs';
import { MaterialModule } from '../../modules/material.module';
import { FilmsService } from '../../services/films.service';
import { UsersService } from '../../services/users.service';

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

  columnsToDisplay = computed(() =>
    this.userNameS()
      ? ['id', 'nazov', 'rok', 'slovenskyNazov', 'afi1998', 'afi2007']
      : ['id', 'nazov', 'rok']
  );
  paginatorS = viewChild.required<MatPaginator>(MatPaginator);
  sortS = viewChild.required<MatSort>(MatSort);
  fiterS = signal('');

  orderByS = signal<string | undefined>(undefined);
  descendingS = signal<boolean | undefined>(undefined);
  indexFromS = signal<number | undefined>(undefined);
  indexToS = signal<number | undefined>(5);
  searchS = signal<string | undefined>(undefined);

  quesryS = computed(
    () =>
      new Query(
        this.orderByS(),
        this.descendingS(),
        this.indexFromS(),
        this.indexToS(),
        this.searchS()
      )
  );

  request$ = toObservable(this.quesryS).pipe(
    tap((query) => console.log('request', query)),
    switchMap((query) =>
      this.filmsService.getFilms(
        query.orderBy,
        query.descending,
        query.indexFrom,
        query.indexTo,
        query.search
      )
    )
  );
  responseS = toSignal(this.request$);
  filmsS = computed(() => this.responseS()?.items || []);

  ngAfterViewInit(): void {
    this.paginatorS().page.subscribe((pageEvent) => {
      console.log('pageEvent', pageEvent);
      this.indexFromS.set(pageEvent.pageIndex * pageEvent.pageSize);
      this.indexToS.set(
        Math.min(
          (pageEvent.pageIndex + 1) * pageEvent.pageSize,
          pageEvent.length
        )
      );
    });
  }

  onFilter(event: any) {
    const filter = (event.target.value as string).trim().toLowerCase();
    this.fiterS.set(filter);
  }
}

class Query {
  constructor(
    public orderBy?: string,
    public descending?: boolean,
    public indexFrom?: number,
    public indexTo?: number,
    public search?: string
  ) {}
}
