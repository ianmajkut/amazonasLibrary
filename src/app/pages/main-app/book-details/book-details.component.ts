import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleBookAPI } from 'src/app/interfaces/interfaces';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styles: [
    `
      .card img {
        max-height: 300px;
        object-fit: cover;
      }
      .btn-primary {
        background-color: #358f80;
        border-color: #358f80;
        color: #fff;
      }

      .btn-primary:hover {
        background-color: #036666;
        border-color: #036666;
        color: #fff;
      }

      .card {
        box-shadow: 12px 12px 5px 0px rgba(212, 190, 190, 0.74);
        border-radius: 10px;
        transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
          0.3s box-shadow,
          0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);
      }

      .card:hover {
        transform: scale(1.05);
      }
    `
  ]
})
export class BookDetailsComponent implements OnInit {
  bookID!: string;
  actualBook!: any;
  bookAvailable!: boolean;
  currentUser!: any;

  constructor(
    private bookService: BooksService,
    private activeRoute: ActivatedRoute,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this.bookID = this.activeRoute.snapshot.params['bookId'];
    this.bookService.seachBookById(this.bookID).subscribe((data) => {
      let book: any = {
        title: data.volumeInfo.title,
        id: data.id,
        isbn: data.volumeInfo?.industryIdentifiers?.filter(
          (data: any) => data.type === 'ISBN_13'
        )[0]?.identifier,
        description: data.volumeInfo?.description,
        thumbnail:
          data.volumeInfo?.imageLinks?.smallThumbnail === undefined
            ? '../../../../assets/noPhoto.jpg'
            : data.volumeInfo?.imageLinks?.smallThumbnail
      };
      this.actualBook = book;
      this.spinner.hide();
      //console.log(this.actualBook);
    });
    this.auth.user.subscribe((user) => {
      this.firestore
        .collection('users', (ref) => ref.where('email', '==', user?.email))
        .valueChanges()
        .subscribe((user) => {
          //Asign the user to the currentUser variable
          this.currentUser = user[0];
        });
    });
  }

  ngOnInit(): void {}

  //Method that handle the book availability, check if the user
  // already rent the book, rent it and
  //upadte the amount of books rented
  saveBook() {
    this.bookService.checkAvailability(this.actualBook, this.currentUser);
  }
}
