import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = { username: '', password: '' };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  doLogin() {
    const url = 'https://legendary-cucurucho-61df20.netlify.app/login'; // Ajusta tu endpoint
    this.http.post<{ token: string }>(url, this.credentials).subscribe({
      next: res => {
        localStorage.setItem('auth_token', res.token);
        this.router.navigateByUrl('/home');
      },
      error: (err: HttpErrorResponse) => {
        alert(err.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'Error de conexión, intenta más tarde');
      }
    });
  }
}
