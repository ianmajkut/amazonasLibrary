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

  checkAvailability(id:string){
    return this.firestore.collection('librosIngresados', ref => ref.where('id', '==', id ).where('cantPrestados', '<', 3)).valueChanges()
    
  }

  async rentBook(book : any, user:any){
    return await this.firestore.collection('prestamos').doc().set({
      bookId: book.id,
      title: book.title,
      isbn: book.isbn,
      dniUSer: user.dni
    })
  }
}
