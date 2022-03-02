import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleBookAPI } from 'src/app/interfaces/interfaces';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styles: [
    `
      .card img {
        max-height: 300px;
        object-fit: cover;
      }
      .btn-primary {
        background-color: #4ab8a1;
        border-color: #4ab8a1;
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
export class BooksComponent implements OnInit {
  books: any = new Array<GoogleBookAPI>();

  index: number = 0;
  searchSpecificBook: boolean = false;

  indexSearch: number = 0;

  //Search 'txtSearch' reference in the html and assign it to the inputText variable
  //@ViewChild('txtSearch') inputText!: ElementRef<HTMLInputElement>

  @ViewChild('myForm') myForm!: NgForm;
  search!: string;

  //PROBLEM: ISSBN IS NOT PRESENT OF CERTAINS BOOKS

  constructor(
    private bookService: BooksService,
    private spinner: NgxSpinnerService
  ) {
    this.getDefaultBooks();
  }

  getDefaultBooks() {
    this.spinner.show();
    this.bookService.getHomeBooksTemplate(this.index).subscribe((data) => {
      data.items.forEach((item: any, index: number) => {
        let book: any = {
          title: item.volumeInfo.title,
          id: item.id,
          isbn: item.volumeInfo.industryIdentifiers?.filter(
            (item: any) => item.type === 'ISBN_13'
          )[0]?.identifier,
          description: item.volumeInfo.description,
          thumbnail: item.volumeInfo.imageLinks?.smallThumbnail
        };
        //console.log(book);
        this.books.push(book);
        this.spinner.hide();
      });
    });
  }

  ngOnInit(): void {}

  searchBook() {
    this.searchSpecificBook = true;
    this.spinner.show();
    this.bookService
      .searchBook(this.search, this.indexSearch)
      .subscribe((data) => {
        this.books = [];
        //console.log(data);
        data.items.forEach((item: any, index: number) => {
          let book: any = {
            title: item.volumeInfo.title,
            id: item.id,
            isbn: item.volumeInfo.industryIdentifiers?.filter(
              (item: any) => item.type === 'ISBN_13'
            )[0]?.identifier,
            description: item.volumeInfo.description,
            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail
          };
          this.books.push(book);
          this.spinner.hide();
        });
      });
  }

  reset() {
    this.books = [];
    this.getDefaultBooks();
  }

  onScroll() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      if (this.searchSpecificBook == false) {
        this.bookService
          .getHomeBooksTemplate(this.index + 21)
          .subscribe((data) => {
            data.items.forEach((item: any, index: number) => {
              let book: any = {
                title: item.volumeInfo.title,
                id: item.id,
                isbn: item.volumeInfo.industryIdentifiers?.filter(
                  (item: any) => item.type === 'ISBN_13'
                )[0]?.identifier,
                description: item.volumeInfo.description,
                thumbnail: item.volumeInfo.imageLinks?.smallThumbnail
              };
              //console.log(book);
              this.books.push(book);
            });
          });
      }
      if (this.searchSpecificBook == true) {
        this.bookService
          .searchBook(this.search, this.indexSearch + 21)
          .subscribe((data) => {
            //console.log(data);
            data.items.forEach((item: any, index: number) => {
              let book: any = {
                title: item.volumeInfo.title,
                id: item.id,
                isbn: item.volumeInfo.industryIdentifiers?.filter(
                  (item: any) => item.type === 'ISBN_13'
                )[0]?.identifier,
                description: item.volumeInfo.description,
                thumbnail: item.volumeInfo.imageLinks?.smallThumbnail
              };
              this.books.push(book);
            });
          });
      }
    }, 3000);
  }
}
