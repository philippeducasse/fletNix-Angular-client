import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileViewComponent } from '../profile-view/profile-view.component';

import { Router } from '@angular/router';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
  ) { } // why curly braces here?


  // this is a lifecycle hook which runs everytime component is initialised
  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies
    });
  }

  openProfilePage(): void {
    this.router.navigate(['profile'])
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

  // showDirector(movie : any): void {

  //   this.dialog.open()
    
  //   }
  

  addToFavorites(movie: any): void {
    this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
      next: (result) => {
        this.snackBar.open(result, 'successfuly added movie to favorites', {
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
   
}
