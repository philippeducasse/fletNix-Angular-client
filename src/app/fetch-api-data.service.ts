import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://fletnix-s949.onrender.com/';
// @ are called decorators, tells Angular to use data from above imports for styling
// additionally, this tells angular that this service will be available everywhere ('root')
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // api call for the user login enpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails)
    return this.http.post(apiUrl + 'login?' + new URLSearchParams(userDetails), {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @returns list of all movies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api to get single movie endpoint
  getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //api to get a director endpoint
  getDirector(name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors' + name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api to get a genre

  getGenre(genre: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres' + genre, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api to get one user

  getUser(user: string): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // api to get favorite movies

  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.Favorites),
      catchError(this.handleError)
    );
  }

  // update user

  updateUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.Username;
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // delete user

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.Username;
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/'+ username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
  // add favorite movie
  ///users/:Username/movies/:MovieID
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = user.Favorites

    favorites.push(movieId);

    return this.http.post(apiUrl + `users/${user.Username}/movies/${movieId}`, {}, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError),
    );
  }


  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const index = user.FavoriteMovies.indexOf(movieId);
    if (index >= 0) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));

    return this.http.delete(apiUrl + `users/${user.Username}/${movieId}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later.')
    ).pipe(catchError(() => throwError(() => new Error('Something went wrong.'))));
  }

}

