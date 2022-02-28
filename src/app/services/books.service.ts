import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleBookAPI } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private key: string = environment.apiKeyBooks
  private baseUrl: string = 'https://www.googleapis.com/books/v1/volumes'

  constructor(private http: HttpClient) { }

  getHomeBooksTemplate() : Observable<GoogleBookAPI>
  {
    const params = new HttpParams()
                  .set('q', 'book')
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
}
