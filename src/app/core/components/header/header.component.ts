import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TokenService} from '../../services/TokenService/token.service';
import {UserService} from '../../services/UserId/user.service';
import {NotificationMissionService} from '../../services/services/notification-mission.service';
import {NgIf} from '@angular/common';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {Notification} from '../../../features/chat/main/models/notification';


@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  unreadCount: number = 0;
  socketClient: any = null;
  private notificationSubscription: any;
  isLoggedIn = false;
  userRoles: string[] = [];

  isAdmin = false;
  isUser = false;
constructor(
  private tokenService: TokenService,
  private router: Router,
  private userService: UserService,
  private notificationService : NotificationMissionService,

) {
}
  checkAuthStatus() {
    this.isLoggedIn = this.tokenService.isTokenValid();
    if (this.isLoggedIn) {
      this.userRoles = this.tokenService.userRoles;

      this.isAdmin = this.userRoles.includes('ADMIN');
      this.isUser = this.userRoles.includes('USER');
    }
  }

  ngOnInit(): void {
  this.loadUnreadCount();
  this.initWebSocket();
  this.checkAuthStatus();
  }


  loadUnreadCount() {
    const userId = this.userService.userId;
    this.notificationService.getUnreadCount({userId:userId!}).subscribe({
      next: (count) => {
        this.unreadCount = count;
        console.log(this.unreadCount);
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    })
  }

  logout() {
    this.tokenService.logout();
    this.isAdmin = false;
    this.isUser = false;
    this.isLoggedIn = false;
    this.userRoles = [];
    this.router.navigate(['']);
  }

  navigateToNotifications() {
    this.router.navigate(['/home/notifications']);
  }

  private initWebSocket() {
    if (this.userService.userId) {
      let ws = new SockJS('http://localhost:8089/api/v1/ws');
      this.socketClient = Stomp.over(ws);
      const subUrl = `/user/${this.userService.userId}/queue/notifications/count`;
      const headers = this.tokenService.token ? { Authorization: 'Bearer ' + this.tokenService.token } : {};
      this.socketClient.connect(headers,
        ()  => {
          this.notificationSubscription = this.socketClient.subscribe(subUrl,
            (message: any) => {
              const count = JSON.parse(message.body);

             this.unreadCount =count;
            },
            () => console.error('Error while connecting to webSocket')
          );
        }
      );
    }
  }
}
