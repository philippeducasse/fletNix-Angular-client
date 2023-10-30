import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

type User = { _id?: string, Username?: string, Password?: string, Email?: string, Birthday?: any, Favorites?: Array<any> }

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  user: User = {};
  userName: string = this.user.Username  as string
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,

  ) { }

  // toggle favorite btn color
  // sets isclicked to an array of boolean values of length movies.length. fill() sets all their default values to false

  isFavorite: boolean[] = []

  // this is a lifecycle hook which runs everytime component is initialised
  ngOnInit(): void {
    this.getMovies();
    console.log(this.isFavorite)
    this.isFavorite = Array(this.movies.length).fill(false); 
    console.log(this.isFavorite)

  }

  // TODO: add movies array to localstorage so that they can be accessed on profile view
  // THEN: write filter logic for displaying favorite movies from IDs in "favorites" array
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies
    });
  }
  openProfilePage(): void {
    const state :{movies: any[]}=  {movies: this.movies}
    this.router.navigate(['profile'], {state})
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
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.user
  }

  addToFavorites(movie: any, index: number): void {
    
    this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
      next: (result) => {
        console.log(result)
        this.isFavorite[index] = true
        this.fetchApiData.getFavoriteMovies(this.userName)
        this.snackBar.open('successfuly added movie to favorites', 'ok',{
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


  removeFromFavorites(movie:any, index: number): void {
    this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe({
      next: () => {
        this.isFavorite[index] = false
        this.snackBar.open('Successfully removed from favorites', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      }
    });
  }
}

