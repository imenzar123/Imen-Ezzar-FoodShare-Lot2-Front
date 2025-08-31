import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  set userId(userId: number) {
    localStorage.setItem('userId', String(userId));
  }

  get userId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }
}
