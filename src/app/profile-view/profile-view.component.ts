import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit{
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  @Input() favoriteMovies = '' // PLACEHOLDER

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  // logic for update user function
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe({
      next: () => {
        
        this.snackBar.open('User updated successfully', 'OK', {
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

  // delete user function
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe({
      next: () => {
        this.snackBar.open('User successfully deleted', 'OK', {
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

  // remove movie from favorites

  removeFromFavorites(): void {
    this.fetchApiData.deleteFavoriteMovie(this.favoriteMovies).subscribe({
      next: (result) => {
        this.snackBar.open(result, 'OK', {
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
