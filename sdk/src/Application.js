import Style from './styles/main.scss';
import ModalStyle from './styles/modal.scss';
import ChatHeaderTemplate from './views/chat-header.html';
import ChatFooterTemplate from './views/chat-footer.html';
import ModalTemplate from './views/modal.html';
import Constants from './Constants';
import AuthType from './AuthType';
import ApplicationStorage from './ApplicationStorage';
import ScreenUtils from './ScreenUtils';
import { NotificationService } from './NotificationService';

export default class Application {
    constructor() {
        this.ApplicationStorage = new ApplicationStorage();
        this.ScreenUtils = new ScreenUtils();
        this.NotificationService = new NotificationService();
        this.widgetMode = false;
        this.connectionStarted = false;

        //Default options
        let config, window, events;

        config = {
            authType: AuthType.GUEST,
            user: {},
            showNotification: Constants.SDK_DEFAULT_SHOW_NOTIFICATION,
        }
        window = {
            target: undefined,
            title: Constants.SDK_DEFAULT_TITLE,
            iconPath: Constants.SDK_DEFAULT_ICON_PATH,
            zIndex: Constants.SDK_DEFAULT_Z_INDEX,
            widgetColor: Constants.SDK_DEFAULT_WIDGET_COLOR,
            hideMenu: Constants.SDK_DEFAULT_HIDE_MENU,
        }
        events = {
            onEnter: () => { },
            onLeave: () => { },
        }

        this.options = {
            config: config,
            window: window,
            events: events,
        }

        this.IFRAMEURL = Constants.IFRAMEURL_LOCAL;

        if (process.env.NODE_ENV === 'homolog') {
            this.IFRAMEURL = Constants.IFRAMEURL_HMG;
        }
        else if (process.env.NODE_ENV === 'production') {
            this.IFRAMEURL = Constants.IFRAMEURL_PRD;
        }

        //Div container for SDK
        let chatEl = document.createElement('div');
        //Div ID
        chatEl.id = 'take-chat';
        this.chatEl = chatEl;
        //Add modalView
        let body = document.getElementsByTagName('body')[0];
        body.insertAdjacentHTML('afterbegin', ModalTemplate);
        document.getElementById("blip-chat-modal").addEventListener('click', () => {
            document.getElementById("blip-chat-modal").classList.remove('isVisible');
            document.getElementById("modal-image").src = "#";
        });
        document.getElementById("modal-image").addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    /* Init chat and set values and styles*/
    openBlipThread(opts) {
        opts = this._parseOldOptionsFormat(opts, this.options);

        let chatOpts = { ...this.options, ...opts };
        this.options = chatOpts;

        //Chat HTML element
        this.buildChat(chatOpts);
    }

    /* Build chat HTML element */
    buildChat(opts) {
        let params = `bot=${this._apiKey}&authType=${opts.config.authType}`;

        if (opts.config.authType === AuthType.DEV) {
            if (!opts.config.user || !opts.config.user.id || !opts.config.user.password) {
                console.error('User id and passoword must be defined when on DEV auth type');
                return;
            }
            var userAccount = {
                userIdentity: this._apiKey + '_' + opts.config.user.id,
                userPassword: btoa(opts.config.user.password),
                userName: opts.config.user.name ? encodeURIComponent(opts.config.user.name) : opts.config.user.name,
                userEmail: opts.config.user.email,
                authType: opts.config.authType
            }
            this.ApplicationStorage._setToLocalStorage(Constants.USER_ACCOUNT_KEY, btoa(JSON.stringify(userAccount)), Constants.COOKIES_EXPIRATION)
        }

        //Chat iframe
        this.chatIframe = document.createElement('iframe');
        this.chatIframe.id = 'iframe-chat';
        this.chatIframe.src = this.IFRAMEURL + '?' + params;
        this.chatIframe.allow = 'geolocation';

        var self = this;

        window.addEventListener('message', (event) => {
            this._onReceivePostMessage(event);
        });

        this.widgetMode = opts.window.target === undefined;

        if (this.widgetMode) {
            this.chatEl.innerHTML = ChatHeaderTemplate;
            this.chatEl.innerHTML += ChatFooterTemplate;
            this.chatEl.appendChild(this.chatIframe);

            this.chatEl.setAttribute('class', 'blip-hidden-chat');

            let isMobile = this.ScreenUtils._isMobile(navigator.userAgent || navigator.vendor || window.opera);

            if (isMobile) {
                this.chatIframe.width = window.innerWidth;
                this.chatIframe.height = window.innerHeight - 60;
                this.chatEl.classList.add('mobile-fixed-window');
                this.chatEl.classList.add('mobile-closed');
            } else {
                this.chatEl.classList.add('fixed-window');
                this.chatIframe.width = 400;
                this.chatIframe.height = 600;
            }

            //Set window config
            this._setWindowOptions(opts.window);

            let body = document.getElementsByTagName('body')[0];
            body.appendChild(this.chatEl);

            let closeBtn = document.getElementById('blip-close-btn');

            window.addEventListener('orientationchange', () => { //close blip chat on iOS when orientation change due to iOS bug
                if (this.ScreenUtils._isIOS() && this.chatEl.getAttribute('class').indexOf('blip-show-chat') == ! -1) {
                    closeBtn.click();
                }
            });

            closeBtn.addEventListener('click', () => {
                if (this.chatEl.getAttribute('class').indexOf('blip-hidden-chat') == ! -1) {

                    //Connect user after opening blip chat widget
                    if (!this.connectionStarted) {
                        this._startConnection();
                    }

                    this.chatEl.setAttribute('class', 'blip-show-chat');

                    if (isMobile) {
                        this.chatEl.classList.add('mobile-fixed-window');
                        this.chatEl.classList.add('mobile-open');
                        document.getElementsByClassName('blip-minimize')[0].style.visibility = "visible";
                        let html = document.getElementsByTagName('html')[0];
                        let body = document.getElementsByTagName('body')[0];
                        html.style.overflow = body.style.overflow = 'hidden';
                        html.style.height = body.style.height = '0';
                        html.style.position = body.style.position = 'static';
                        if (this.ScreenUtils._isIOS()) {
                            this.chatEl.style.position = 'absolute';
                        }
                    } else {
                        this.chatEl.classList.add('fixed-window');
                    }

                    //Enter chat callback
                    setTimeout(() => {
                        opts.events.onEnter();
                    }, 500);
                }
                else {

                    this.chatEl.setAttribute('class', 'blip-hidden-chat');

                    if (isMobile) {
                        this.chatEl.classList.add('mobile-fixed-window');
                        this.chatEl.classList.add('mobile-closed');
                        document.getElementsByClassName('blip-minimize')[0].style.visibility = "hidden";
                        let html = document.getElementsByTagName('html')[0];
                        let body = document.getElementsByTagName('body')[0];
                        html.style.overflow = body.style.overflow = '';
                        html.style.height = body.style.height = '';
                        html.style.position = body.style.position = '';
                        if (this.ScreenUtils._isIOS()) {
                            this.chatEl.style.position = 'fixed';
                        }
                    } else {
                        this.chatEl.classList.add('fixed-window');
                    }

                    //Leave chat callback
                    setTimeout(() => {
                        opts.events.onLeave();
                    }, 500);
                }
            });

        } else {

            this.chatEl.setAttribute('class', 'target-window');
            this.chatEl.appendChild(this.chatIframe);

            this.chatIframe.classList.add('target-window-iframe');
            let chatTarget = document.getElementById(opts.window.target);

            chatTarget.appendChild(this.chatEl);
        }

    }

    destroy() {
        if (this.options.window.target !== undefined) {
            let element = document.getElementById(this.options.window.target);
            element.removeChild(this.chatEl);
        } else {
            let body = document.getElementsByTagName('body')[0];
            body.removeChild(this.chatEl);
        }
    }

    _setWindowOptions(windowOpts) {
        this._setChatTitle(windowOpts.title);
        this._setChatIcon(windowOpts.iconPath);
        this._setZIndex(windowOpts.zIndex);
        this._setWidgetColor(windowOpts.widgetColor);
    }

    _setChatTitle(title) {
        let chatTitle = title || Constants.SDK_DEFAULT_TITLE;
        this.chatEl.querySelector('#chat-header-text').innerHTML = chatTitle;
    }

    _setChatIcon(iconPath) {
        let chatIconPath = iconPath || Constants.SDK_DEFAULT_ICON_PATH;
        this.chatEl.querySelector('#chat-header-icon').src = chatIconPath;
    }

    _setZIndex(value) {
        let zIndex = value || Constants.SDK_DEFAULT_Z_INDEX;
        this.chatEl.style.zIndex = zIndex;
    }

    _setWidgetColor(color) {
        let widgetColor = color || Constants.SDK_DEFAULT_WIDGET_COLOR;
        this.chatEl.style.backgroundColor = color;
    }

    _sendMessage(message) {
        var postMessage = { code: Constants.SEND_MESSAGE_CODE, content: message }
        document.getElementById('iframe-chat').contentWindow.postMessage(postMessage, this.IFRAMEURL);
    }


    _onReceivePostMessage(event) {
        console.log('sdk web', event);

        const origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
        if (this.IFRAMEURL.indexOf(origin) === -1) {
            return;
        }
        switch (event.data.code) {
            case Constants.REQUEST_POST_MESSAGE_CODE:
                let iframe = document.getElementById('iframe-chat');
                let message =
                    {
                        code: Constants.MENU_VISIBILITY_CODE,
                        hideMenu: this.options.window.hideMenu === undefined ? Constants.SDK_DEFAULT_HIDE_MENU : this.options.window.hideMenu,
                    };
                iframe.contentWindow.postMessage(message, this.IFRAMEURL); //send hideMenu option to common

                message = {
                    code: Constants.SHOW_NOTIFICATION_CODE,
                    showNotification: this.options.config.showNotification === undefined ? Constants.SDK_DEFAULT_SHOW_NOTIFICATION : this.options.config.showNotification,
                };
                iframe.contentWindow.postMessage(message, this.IFRAMEURL); //send showNotification option to common

                if (this.widgetMode) { // Show widget after sdk common is ready
                    document.getElementById('take-chat').style.visibility = 'visible';
                    document.getElementById('take-chat').style.opacity = 1;
                } else {
                    this._startConnection();
                }

                break;

            case Constants.COOKIE_DATA_CODE:
                this.ApplicationStorage._setToLocalStorage(Constants.USER_ACCOUNT_KEY, event.data.userAccount);
                break;

            case Constants.ACTION_SHOW_IMAGE_CODE:
                document.getElementById("modal-image").src = event.data.imageSrc;
                document.getElementById("blip-chat-modal").classList.add('isVisible');
                break;
            case Constants.ACTION_NOTIFY_MESSAGE_CODE:
                this.NotificationService._notifyReceivedMessage(event.data.botName, event.data.unreadMessagesCount);
                break;
            case Constants.REQUEST_HIDE_BLIP_AD:
                document.getElementById("blip-footer").style.display = "none";
                break;
        }
    }

    _startConnection() {
        let iframe = document.getElementById('iframe-chat');
        let account = this.ApplicationStorage._getFromLocalStorage(Constants.USER_ACCOUNT_KEY);
        console.log('sdk web account', account);

        let message =
            {
                code: Constants.START_CONNECTION_CODE,
                userAccount: account,
            };
        iframe.contentWindow.postMessage(message, this.IFRAMEURL);

        this.connectionStarted = true;
    }

    _parseOldOptionsFormat(opts, defaultOpts) {

        if (!opts) {
            return defaultOpts;
        }

        if (opts.config || opts.window || opts.events) {
            return opts;
        }

        return {
            config: {
                authType: opts.authType || defaultOpts.config.authType,
                user: opts.user || defaultOpts.config.user
            },
            window: {
                target: opts.target || defaultOpts.window.target,
                title: opts.title || defaultOpts.window.title,
                iconPath: opts.iconPath || defaultOpts.window.iconPath,
                zIndex: opts.zIndex || defaultOpts.window.zIndex,
                widgetColor: opts.widgetColor || defaultOpts.window.widgetColor
            },
            events: {
                onEnter: opts.onEnter || defaultOpts.events.onEnter,
                onLeave: opts.onLeave || defaultOpts.events.onLeave,
            }
        }
    }
}
