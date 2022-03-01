import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleBookAPI } from 'src/app/interfaces/interfaces';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styles: [
  ]
})
export class BookDetailsComponent implements OnInit {

  bookID!: string
  actualBook!: any 
  bookAvailable!: boolean

  constructor(private bookService: BooksService, private activeRoute: ActivatedRoute) {
    this.bookID = this.activeRoute.snapshot.params['bookId']
    this.bookService.seachBookById(this.bookID).subscribe(
      (data) => {
        let book : any  = {
          title: data.volumeInfo.title,
          id: data.id,
          isbn: data.volumeInfo?.industryIdentifiers?.filter((data: any) => data.type === 'ISBN_13')[0]?.identifier ,
          description: data.volumeInfo?.description ,
          thumbnail: data.volumeInfo?.imageLinks?.smallThumbnail === undefined ? '../../../../assets/noPhoto.jpg' : data.volumeInfo?.imageLinks?.smallThumbnail,
        }
        this.actualBook = book
        //console.log(this.actualBook);
      }
    )
  }

  ngOnInit(): void {
  }

  checkBook(){
    this.bookService.checkAvailability(this.actualBook.id).subscribe(
      (book) => {
        console.log('Book Available');
      }
    )
  }

  saveBook(){
    
  }

}
