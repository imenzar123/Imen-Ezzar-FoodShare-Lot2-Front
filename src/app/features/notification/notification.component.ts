import {Component, OnInit} from '@angular/core';
import {NotificationMission} from '../../core/services/models/notification-mission';
import {NotificationMissionService} from '../../core/services/services/notification-mission.service';
import {Router} from '@angular/router';
import {UserService} from '../../core/services/UserId/user.service';
import {formatDate, NgForOf, NgIf ,Location} from '@angular/common';
import SockJS from 'sockjs-client';

import * as Stomp from 'stompjs';
import {TokenService} from '../../core/services/TokenService/token.service';
@Component({
  selector: 'app-notification',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './notification.component.html',
  standalone: true,
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  notifications: NotificationMission[] = [];
  isLoading: boolean = false;
  socketClient: any = null;
 constructor(
   private notificationService: NotificationMissionService,
   private router: Router,
   private userService: UserService,
   private location: Location,
   private tokenService: TokenService,
 ) {
  }
  ngOnInit(): void {
  this.initWebSocket();
  this.loadNotifications()
  }

  loadNotifications(){
    this.isLoading = true;
   const userId = this.userService.userId;
      this.notificationService.getAllNotifications({userId:userId!}).subscribe({
        next: (res) => {
       this.isLoading = false;
           this.notifications = res;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error marking as read:', error);
        }
      })
  }






  markAsRead(notification: NotificationMission, event: Event) {
    event.stopPropagation();
    this.notificationService.markAsRead({id: notification.id!}).subscribe({
      next: (res) => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking as read:', error);
      }
    })
  }
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'MISSION_ASSIGNED': return '📋';
      case 'MISSION_CREATED': return '🆕';
      case 'MISSION_UPDATED': return '🔄';
      case 'MISSION_COMPLETED': return '✅';
      default: return '🔔';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    this.location.back();
  }

  markAllAsRead() {
    const userId = this.userService.userId;

    this.notificationService.markAllAsRead({userId:userId!}).subscribe({
      next: (res) => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking as read:', error);
      }
    })


  }

  private initWebSocket() {
    if (this.userService.userId) {
      let ws = new SockJS('http://localhost:8089/api/v1/ws');
      this.socketClient = Stomp.over(ws);
      const subUrl = `/user/${this.userService.userId}/queue/notifications`;
      const headers = this.tokenService.token ? { Authorization: 'Bearer ' + this.tokenService.token } : {};
      this.socketClient.connect(headers,
        ()  => {
          this.socketClient.subscribe(subUrl,
            (message: any) => {
              const newNotification: NotificationMission = JSON.parse(message.body);
              console.log('Nouvelle notification reçue en temps réel:', newNotification);


              this.notifications = [newNotification, ...this.notifications];
              console.log(this.notifications);
            },
            () => console.error('Error while connecting to webSocket')
          );
        }
      );
    }
  }
}
