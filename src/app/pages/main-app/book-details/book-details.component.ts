import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  currentUser!: any

  constructor(private bookService: BooksService, private activeRoute: ActivatedRoute, private auth : AngularFireAuth, private firestore: AngularFirestore) {
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
    this.auth.user.subscribe(user => {
      this.firestore.collection('users', ref => ref.where('email', '==', user?.email)).valueChanges().subscribe(user => {
          //Asign the user to the currentUser variable
          this.currentUser=user[0] 
        })
    })
  }

  ngOnInit(): void {
  }
  
  //Method that handle the book availability, rent the book and
  //upadte the amount of books rented
  saveBook(){
    this.bookService.checkAvailability(this.actualBook, this.currentUser)
  }

}
