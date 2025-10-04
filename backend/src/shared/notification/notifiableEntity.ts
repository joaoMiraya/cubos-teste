import { Notification } from "./notification";


export abstract class NotifiableEntity {
  private notification: Notification;

  constructor() {
    this.notification = new Notification();
  }

  getNotification(): Notification {
    return this.notification;
  }

  hasErrors(): boolean {
    return this.notification.hasErrors();
  }

  protected addError(message: string, context?: string): void {
    this.notification.addError({ message, context });
  }

  abstract validate(): void;
}