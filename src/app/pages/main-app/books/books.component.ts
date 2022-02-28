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
  `
  ]
})
export class BooksComponent implements OnInit {

  books: any = new Array<GoogleBookAPI>()

  //Search 'txtSearch' reference in the html and assign it to the inputText variable
  //@ViewChild('txtSearch') inputText!: ElementRef<HTMLInputElement>
  
  @ViewChild('myForm') myForm!: NgForm
  search!: string

  constructor(private bookService: BooksService) { 
    this.bookService.getHomeBooksTemplate().subscribe(
      (data) => {
        for(let item of data.items){
          let book : any  = {
            title: item.volumeInfo?.title,
            description: item.volumeInfo?.description,
            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail  
          }
          this.books.push(book)
        }
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
        console.log(data);
        for(let item of data.items){
          let book : any  = {
            title: item.volumeInfo.title,
            description: item.volumeInfo.description ,
            thumbnail: item.volumeInfo.imageLinks?.smallThumbnail  
          }
          console.log(this.books);
          this.books.push(book)
          
        }
      }
    )
  }

}
