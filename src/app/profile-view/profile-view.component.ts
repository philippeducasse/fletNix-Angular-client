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
  
  allMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {this.allMovies = this.router.getCurrentNavigation()?.extras.state as any[]
    console.log(this.allMovies)     
      }

    ngOnInit(): void {
      // gets user info
      
      const user = this.getUser();
      this.user = user;
      this.userData = {
        Username: user.Username || "",
        Email: user.Email || "",
        Password: "",
        Birthday: user.Birthday || "",
        Favorites: user.Favorites || [],
      }
      console.log(this.userData)
    // gets movies from main view
      this.getFavorites()
    }

    
  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getFavorites(): void {
    // console.log(typeof this.allMovies.filter((m) => {this.allMovies.includes('B')}))
    console.log(Object.values(this.allMovies))
    console.log(Object.keys(this.allMovies))
    console.log(this.userData.Favorites)
    console.log(Object.values(this.allMovies).filter((m) => m._id.includes(this.userData.Favorites[0])))
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
