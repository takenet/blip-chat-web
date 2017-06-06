export class NotificationService {

    constructor() {
        this.pageTitle = window.document.title;
        this.notificationTimer;
        window.document.addEventListener('visibilitychange', this._onVisibilityChange);
    }

    _onVisibilityChange() {
        if (window.document.hidden) {
            return;
        }

        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);

        if (this.pageTitle) {
            this._changeWindowTitle(this.pageTitle);
        }
    }

    _notifyReceivedMessage(botName, unreadMessagesCount) {
        this.botName = botName;
        if (window.document.hidden) {
            var unreadMsgNot = unreadMessagesCount > 0 ? "(" + unreadMessagesCount + ") " : "";
            let notificationTitle = unreadMsgNot + botName + " diz...";
            this._showNotification(notificationTitle);
            this.notificationTimer = setInterval( () => this._showNotification(notificationTitle), 3000);
        }
    }

    _showNotification(notificationTitle) {
        this._changeWindowTitle(notificationTitle);
        setTimeout( () => this._changeWindowTitle(this.pageTitle), 1500);
    }

    _changeWindowTitle(title) {
        window.document.title = title;
    }
}



