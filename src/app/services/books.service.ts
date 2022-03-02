import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleBookAPI } from '../interfaces/interfaces';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class BooksService {

  private key: string = environment.apiKeyBooks
  private baseUrl: string = 'https://www.googleapis.com/books/v1/volumes'
  
  userHasThisBook!: boolean 
  
  librosIngresadosData!: any

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
        Swal.fire({
          icon: 'error',
          title: 'You cannot reserve this book',
          text: 'We are sorry but the book is at the maximum amount of 3 reservations',
        })
      }
      //If we have less than 3 books with the same id, the book is available
      if(res.size < 3){
        console.log('Podes reservar este libro');
        let sizePrestamos = res.size 
        //Check if the user has this book
        this.checkUserAlreadyHasThisBook(book, user, sizePrestamos)
      
      }
    })
  }

  
  async checkUserAlreadyHasThisBook(book: any, user: any, sizePrestamos: number){
    //Check if the user has already rented this book
    return await this.firestore.collection('prestamos', ref => ref.where('dniUSer', '==', user.dni ).where('bookId', '==', book.id ))
    .get()
    .subscribe(res =>{
      if(res.size > 0){
        Swal.fire({
          icon: 'error',
          title: 'You already have this book',
          text: 'You already have this book so read it and return it to the library to get a new one please :)', 
        })
      }
      if(res.size === 0){
        console.log('This user has not this book');
        //Add the book to the db 'prestamos' collection
        this.rentBook(book, user)
        //Increase the amount of books with the same id here 
        let cantPrestados = sizePrestamos + 1
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
    Swal.fire({
      icon: 'success',
      title: 'Book rented successfully :)',
      showConfirmButton: false,
      timer: 2000
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

  async updateBookEntered(book: any){
    //Get the book from the db that has the same id of the book that we want to update
    await this.firestore.collectionGroup('librosIngresados', ref => ref.where('id', '==', book.bookId)).valueChanges().subscribe(res => {
      //Set the result to a variable
      this.librosIngresadosData = res[0]
      console.log(`Cantidad de libros prestados para este item ${this.librosIngresadosData.cantPrestados}`);
      //If the amount of books with the same id is more than 1, decrease the amount of books
        if(this.librosIngresadosData.cantPrestados > 1){
          console.log('Hay mas de un libro con este id');
          this.firestore.collection('librosIngresados').doc(book.bookId).update({
          //We access the amount of books value and decrease it by 1
          cantPrestados: this.librosIngresadosData.cantPrestados - 1
        })
        }
        //If the amount of books with the same id is 1, delete the book from the db
        if(this.librosIngresadosData.cantPrestados === 1 ){
          console.log('Hay menos de un libro con este id');
          this.firestore.collection('librosIngresados').doc(book.bookId).delete()
        }
      }
    )
    
    
    
    

  }

  async deleteBook(book: any){
    await this.firestore.collection('prestamos', ref => ref.where('bookId', '==', book.bookId).where('dniUSer', '==', book.dniUSer ))
    .get().subscribe(res => {
      //Obtain the id of the doc that is an unique id
      console.log(res.docs[0].id);
      //Delete the book from the db
      this.firestore.collection('prestamos').doc(res.docs[0].id).delete()
      Swal.fire({
        icon: 'success',
        title: 'Thank you for returning the book, we hope you enjoyed it :)',
        showConfirmButton: false,
        timer: 2000
      })
      //Call the updateBook method to update the amount of books with the same id
      this.updateBookEntered(book)
    })
    
  }

}
