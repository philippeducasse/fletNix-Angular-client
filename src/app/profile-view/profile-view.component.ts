import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type User = { _id?: string, Username?: string, Password?: string, Email?: string, Birthday?: any, Favorites?: Array<any> }

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit{
  user: User = {};
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '', Favorites: [] as Array<any> };
  // @Input() favoriteMovies = [];
  

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,) { }

    ngOnInit(): void {
      const user = this.getUser();
  
      this.user = user;
      this.userData = {
        Username: user.Username || "",
        Email: user.Email || "",
        Password: "",
        Birthday: user.Birthday || "",
        Favorites: user.Favorites || [],
      }
      console.log(user)
      console.log(this.userData.Favorites)
    
    }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getFavorites(): void {
    return 
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

  //should be (movies: any?)
  // removeFromFavorites(): void {
  //   this.fetchApiData.deleteFavoriteMovie(this.favoriteMovies).subscribe({
  //     next: (result) => {
  //       this.snackBar.open(result, 'OK', {
  //         duration: 2000
  //       });
  //     },
  //     error: (error) => {
  //       this.snackBar.open(error, 'Error', {
  //         duration: 2000
  //       });
  //     }
  //   });
  // }
  logoutUser(): void {
    localStorage.clear
    this.router.navigate(['welcome'])
  }
}
