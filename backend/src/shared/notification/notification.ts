export interface NotificationError {
  message: string;
  context: string | undefined;
}

export class Notification {
    private errors: NotificationError[] = [];

    addError(error: NotificationError): void {
        this.errors.push(error);
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    getErrors(): NotificationError[] {
        return this.errors;
    }

    messages(context?: string): string {
        const filteredErrors = context
            ? this.errors.filter(err => err.context === context)
            : this.errors;

        return filteredErrors
            .map(err => `${err.context ? `${err.context}: ` : ''}${err.message}`)
            .join(', ');
    }

    clear(): void {
        this.errors = [];
    }
}