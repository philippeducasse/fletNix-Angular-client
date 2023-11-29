import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

type User = { _id: string, Username: string, Password: string, Email: string, Birthday: any, Favorites: Array<any> }


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,

  ) { }

  // toggle favorite btn color
  // sets isclicked to an array of boolean values of length movies.length. fill() sets all their default values to false

  // isFavorite: boolean[] = []

  // this is a lifecycle hook which runs everytime component is initialised
  async ngOnInit(): Promise<void> {
    const user = this.getUser();
    await this.getMovies();
    await this.fetchFavorites(user);
    console.log(this.favorites);
  }

  // TODO: add movies array to localstorage so that they can be accessed on profile view
  // THEN: write filter logic for displaying favorite movies from IDs in "favorites" array
  getMovies(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fetchApiData.getAllMovies().subscribe(
        (resp: any) => {
          this.movies = resp;
          console.log(this.movies);
          resolve(); // Resolve the Promise once movies are fetched
        },
        (error: any) => {
          reject(error); // Reject the Promise if there's an error fetching movies
        }
      );
    });
  }
  openProfilePage(): void {
    const state: { movies: any[] } = { movies: this.movies }
    this.router.navigate(['profile'], { state })
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      }
    })
  }

  openSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: "Description",
        content: synopsis,
      }
    })
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: director.Name,
        content: director.Bio,
      }
    })
  }

  logoutUser(): void {
    localStorage.clear
    this.router.navigate(['welcome'])
  }
  getUser(): User {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    return user
  }

  addToFavorites(movie: any): void {
    console.log(movie)
    movie.isFavorite = true; // Update isFavorite property
    this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
      next: (result) => {
        console.log(result)
        // this.isFavorite[index] = true
        this.snackBar.open('successfuly added movie to favorites', 'ok', {
          duration: 2000
        });
      },
      error: (error) => {
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      }
    })
  }
  // remove movie from favorites


  removeFromFavorites(movie: any): void {
    // this.isFavorite[index] = false
    movie.isFavorite = false; // Update isFavorite property
    this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe({
      next: (result) => {
        console.log(result)
        this.snackBar.open('Successfully removed from favorites', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        console.log(error)
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      }
    });
  }
  async fetchFavorites(user: User): Promise<void> {
    try {
      const resp: any = await this.fetchApiData.getFavoriteMovies(user.Username).toPromise();
      this.favorites = resp;
  
      // Update movies to add isFavorite property
      this.movies = this.movies.map(movie => {
        if (this.favorites.some(favorite => favorite === movie._id)) {
          return { ...movie, isFavorite: true };
        } else {
          return { ...movie, isFavorite: false };
        }
      });
  
      console.log(this.movies);
    } catch (error) {
      console.error(error);
    }
  }
}
