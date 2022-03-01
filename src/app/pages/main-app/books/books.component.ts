import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GoogleBookAPI } from 'src/app/interfaces/interfaces';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styles: [`
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
  `
  ]
})
export class BooksComponent implements OnInit {

  books: any = new Array<GoogleBookAPI>()

  //Search 'txtSearch' reference in the html and assign it to the inputText variable
  //@ViewChild('txtSearch') inputText!: ElementRef<HTMLInputElement>
  
  @ViewChild('myForm') myForm!: NgForm
  search!: string

  //PROBLEM: ISSBN IS NOT PRESENT OF CERTAINS BOOKS

  constructor(private bookService: BooksService) { 
    this.bookService.getHomeBooksTemplate().subscribe(
      (data) => {
        data.items.forEach((item: any, index: number) => {
          let book : any  = {
            title: item.volumeInfo.title,
            id: item.id,
            isbn: item.volumeInfo.industryIdentifiers?.filter((item: any) => item.type === 'ISBN_13')[0]?.identifier,
            description: item.volumeInfo.description ,
            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail  
          }
          //console.log(book);
          this.books.push(book)
          
        })
      }
    )
    
  }

  ngOnInit(): void {
  }

  searchBook(){
    const searchValue = this.search
    
    this.bookService.searchBook(searchValue).subscribe(
      (data) => {
        this.books = []
        //console.log(data);
        data.items.forEach((item: any, index: number) => {
          let book : any  = {
            title: item.volumeInfo.title,
            id: item.id,
            isbn: item.volumeInfo.industryIdentifiers?.filter((item: any) => item.type === 'ISBN_13')[0]?.identifier,
            description: item.volumeInfo.description ,
            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail  
          }
          this.books.push(book)
          
        })
      }
    )
  }

  index(book: GoogleBookAPI){
    console.log(book);
  }

  

  

}
