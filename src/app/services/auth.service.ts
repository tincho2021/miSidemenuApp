import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated = false;

  login(user: string, pass: string): boolean {
    // Ajusta esta lógica a tu backend o credenciales reales
    if (user === 'admin' && pass === '1234') {
      this._authenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this._authenticated = false;
  }

  isAuthenticated(): boolean {
    return this._authenticated;
  }
}