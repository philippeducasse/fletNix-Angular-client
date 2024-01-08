import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://fletnix-b399cde14eec.herokuapp.com/';
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
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError((error: any) => {
        // Unauthorized access - Invalid signup credentials
        if (error.status === 401 || error.status === 402 || error.status === 422) {
          return throwError(() => new Error('Invalid input, please check again.'));
        } else return this.handleError(error) // this is the generic error display
      })
    );
  }

  // api call for the user login enpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails)
    return this.http.post(apiUrl + 'login?' + new URLSearchParams(userDetails), {}).pipe(
      catchError((error: any) => {
        // Unauthorized access - Invalid login credentials
        if (error.status === 401 || error.status === 400) {
          return throwError(() => new Error('Invalid username or password.'));
        } else return this.handleError(error);
      }
      ));
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
    return this.http.get(apiUrl + 'movies/' + title, {
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
    return this.http.get(apiUrl + 'genres/' + genre, {
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
      catchError((error) => {
        // Unauthorized access - Invalid signup credentials
        if (error.status === 401 || error.status === 402 || error.status === 422) {
          return throwError(() => new Error('Invalid input, please check again.'));
        }else return this.handleError(error)}
    ));
  }
  // delete user

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.Username;
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      observe: 'response',
      responseType: 'text',
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // add favorite movie
  ///users/:Username/movies/:MovieID
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = user.Favorites
    console.log(movieId)
    favorites.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

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

    const index = user.Favorites.indexOf(movieId);
    if (index >= 0) {
      user.Favorites.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));

    return this.http.delete(apiUrl + `users/${user.Username}/movies/${movieId}`, {
      observe: 'response',
      responseType: 'text',
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else if (error.status === 200) {
      // If the status code is 200, it's a successful response, handle it accordingly
      console.log('Success:', error.statusText);
      return EMPTY; // Return an observable indicating successful operation
    } else {
      // For other status codes, log the error details
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }

    // Return an observable indicating an error occurred
    return throwError(() => new Error('Something bad happened; please try again later.'))
      .pipe(
        catchError(() => throwError(() => new Error('Something went wrong.')))
      );
  }
}



