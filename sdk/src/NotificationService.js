export class NotificationService {

    constructor() {
        this.notificationBlinkInterval = 4000;
        this.pageTitle = window.document.title;
        this.botName;
        this.notificationTimer;
        window.document.addEventListener('visibilitychange', () => { this._onVisibilityChange(); });
    }

    _onVisibilityChange() {
        if (window.document.hidden) {//if tab is being hidden
            return;
        }

        this._clearTimer()

        if (this.pageTitle) {
            this._changeWindowTitle(this.pageTitle);
        }
    }

    _notifyReceivedMessage(botName, unreadMessagesCount) {
        this.botName = botName;
        if (window.document.hidden) {
            var unreadMsgNot = unreadMessagesCount > 0 ? "(" + unreadMessagesCount + ") " : "";
            let notificationTitle = unreadMsgNot + botName + " diz...";
            this._clearTimer();
            this._showNotification(notificationTitle);
            this.notificationTimer = setInterval(() => this._showNotification(notificationTitle), this.notificationBlinkInterval);
        }
    }

    _showNotification(notificationTitle) {
        this._changeWindowTitle(notificationTitle);
        setTimeout(() => this._changeWindowTitle(this.pageTitle), this.notificationBlinkInterval / 2);
    }

    _changeWindowTitle(title) {
        window.document.title = title;
    }

    _clearTimer() {
        if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
            this.notificationTimer = undefined;
        }
    }
}



