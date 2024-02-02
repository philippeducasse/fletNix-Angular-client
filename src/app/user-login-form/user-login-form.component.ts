import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';



@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };
  
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
    ) {}
  
  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        // Logic for successful user login
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close(); // Closes the modal on success
        this.snackBar.open(`Welcome, ${result.user.Username} !`, 'OK', {
          duration: 4000
        });
        this.router.navigate(['movies'])
      },
      error: (error) => {
        // Handle errors here
        this.snackBar.open(error, 'Close', { // Provide a more informative message
          duration: 4000
        });
      }
    });
  }
}  
    