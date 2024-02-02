import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';


type User = { _id?: string, Username?: string, Password?: string, Email?: string, Birthday?: any, Favorites?: Array<any> }

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  user: User = {};
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '', Favorites: [] as Array<any> };

  allMovies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
  ) {
    const state: { movies: any[] } = this.router.getCurrentNavigation()?.extras.state as any
    console.log(state && state['movies'])
    this.allMovies = state && state['movies']
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
    // gets movies from main view
    this.getFavorites()

  }


  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getFavorites(): any[] {
    const filteredMovies = this.allMovies.filter((m) => this.userData.Favorites.includes(m._id))
    return this.favoriteMovies = filteredMovies
  }
  // logic for update user function
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe({
      next: (result) => {
        console.log(result)
        this.snackBar.open('User updated successfully', 'OK', {
          duration: 4000
        });
      },
      error: (error) => {
        console.log(error)
        this.snackBar.open(error, 'OK', {
          duration: 4000
        });
      }
    });
  }
  deleteUser(): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: "Delete Account",
        content: 'Are you sure?',
        confirm: {
          text: 'Delete', // Text for the confirmation button
          function:
            () => this.confirmDeleteUser()
        }
      }
    }
    )
  }
 
  
  // delete user function
  confirmDeleteUser(): void {
    this.fetchApiData.deleteUser().subscribe({
      next: (result) => {
        console.log(result)
        this.snackBar.open('User successfully deleted', 'OK', {
          duration: 4000
        });
        this.dialog.closeAll()
        this.router.navigate(['welcome']);
      },
      error: (error) => {
        console.log(error)
        this.snackBar.open(error, 'Error', {
          duration: 4000
        });
        this.dialog.closeAll()
      }
    });
  }
  
  logoutUser(): void {
    localStorage.clear()
    this.router.navigate(['welcome'])
  }
}
