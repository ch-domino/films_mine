import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

const modules = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatTableModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [modules],
  exports: [modules],
})
export class MaterialModule {}
