import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BooksComponent } from './books/books.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [ProfileComponent, HomePageComponent, BooksComponent],
  imports: [
    CommonModule,
    BooksRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    InfiniteScrollModule
  ]
})
export class BooksModule {}
