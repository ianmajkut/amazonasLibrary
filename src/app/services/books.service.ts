import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleBookAPI } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private key: string = environment.apiKeyBooks
  private baseUrl: string = 'https://www.googleapis.com/books/v1/volumes'

  

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getHomeBooksTemplate() : Observable<GoogleBookAPI>
  {
    const params = new HttpParams()
                  .set('q', 'star wars')
                  .set('maxResults', '40')
                  .set('key', this.key )

    return this.http.get<GoogleBookAPI>(`${this.baseUrl}`, {params})
  }

  searchBook(param: string): Observable<GoogleBookAPI>{
    const params = new HttpParams()
                  .set('q', param)
                  .set('maxResults', '10')
                  .set('key', this.key )

    return this.http.get<GoogleBookAPI>(`${this.baseUrl}`, {params})
  }

  seachBookById(id:string){
    return this.http.get<GoogleBookAPI>(`${this.baseUrl}/${id}`)
  }

  async checkAvailability(book: any, user: any){
    //Check the amouunt of books on the db 'prestamos' collection that have the same id of the book
    return await this.firestore.collection('prestamos', ref => ref.where('bookId', '==', book.id )).get()
    .subscribe(res => {
      console.log(res.size)
      //If we have 3 books with the same id, the book is not available
      if(res.size == 3){
        console.log('No podes reservar este libro');
      }
      //If we have less than 3 books with the same id, the book is available
      if(res.size < 3){
        console.log('Podes reservar este libro');
        //Add the book to the db 'prestamos' collection
        this.rentBook(book, user)
        //Increase the amount of books with the same id here 
        let cantPrestados = res.size + 1
        //Call the updateBook method to update the amount of books with the same id
        this.bookEntered(book, cantPrestados)
      }
    })
  }

  async rentBook(book : any, user:any){
    //Save book on db
    //Set the information required to save the book on the db
    await this.firestore.collection('prestamos').doc().set({
      bookId: book.id,
      title: book.title,
      isbn: book.isbn,
      dniUSer: user.dni,
      dayPrestado: new Date().toLocaleDateString(),
    })
    return console.log('Book saved');
  }

  
  async bookEntered(book: any, cantPrestados: number){
    //Update the amount of books with the same id
    await this.firestore.collection('librosIngresados').doc(book.id).set({
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      cantPrestados: cantPrestados,
    })
  }

}
