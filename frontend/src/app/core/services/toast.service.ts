import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private notifications$ = new BehaviorSubject<ToastNotification[]>([]);
  public notifications = this.notifications$.asObservable();

  constructor() {}

  show(notification: Omit<ToastNotification, 'id'>) {
    const id = this.generateId();
    const newNotification: ToastNotification = {
      id,
      duration: notification.duration || 5000,
      ...notification
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, newNotification.duration);
    }
  }

  success(title: string, message: string, duration?: number) {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration?: number) {
    this.show({
      type: 'error',
      title,
      message,
      duration: duration || 7000 // Errors stay longer
    });
  }

  warning(title: string, message: string, duration?: number) {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration?: number) {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  remove(id: string) {
    const currentNotifications = this.notifications$.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(filteredNotifications);
  }

  clear() {
    this.notifications$.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}