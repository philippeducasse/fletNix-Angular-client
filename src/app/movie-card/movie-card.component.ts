import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileViewComponent } from '../profile-view/profile-view.component';

import { Router } from '@angular/router';


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


  // this is a lifecycle hook which runs everytime componennt is initialised
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

  showDirector(movie : any): void {

    return movie.director
    
    }
  

  // addToFavorites(movie: any): void {
  //   this.fetchApiData.addFavoriteMovie(movie.id).subscribe({
  //     next: (result) => {
  //       this.snackBar.open(result, 'successfuly added movie to favorites', {
  //         duration: 2000
  //       });
  //     },
  //     error: (error) => {
  //       this.snackBar.open(error, 'Error', {
  //         duration: 2000
  //       });
  //     }
  //   })
  // }
  //   logoutUser(): void {
  //     this.fetchApiData.l
  //   }
}
