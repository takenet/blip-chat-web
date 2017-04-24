import Style from './style.css';
import ChatHeaderTemplate from './chat-header.html';
import ChatFooterTemplate from './chat-footer.html';
import Constants from './Constants';
import AuthType from './AuthType';

export default class Application {
  constructor() {
    //Default options
    let config, window, events;

    config = {
      authType: AuthType.GUEST,
      user: {},
    }
    window = {
      target: undefined,
      title: Constants.SDK_DEFAULT_TITLE,
      iconPath: Constants.SDK_DEFAULT_ICON_PATH,
      zIndex: Constants.SDK_DEFAULT_Z_INDEX,
      widgetColor: Constants.SDK_DEFAULT_WIDGET_COLOR,
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

    Application.IFRAMEURL = Constants.IFRAMEURL_LOCAL;

    if (process.env.NODE_ENV === 'homolog') {
      Application.IFRAMEURL = Constants.IFRAMEURL_HMG;
    }
    else if (process.env.NODE_ENV === 'production') {
      Application.IFRAMEURL = Constants.IFRAMEURL_PRD;
    }

    //Div container for SDK
    let chatEl = document.createElement('div');
    //Div ID 
    chatEl.id = 'take-chat';
    this.chatEl = chatEl;

  }

  /* Init chat and set values and styles*/
  openBlipThread(opts) {

    opts = _parseOldOptionsFormat(opts, this.options);

    let chatOpts = { ...this.options, ...opts };
    this.options = chatOpts;

    //Chat HTML element
    this.buildChat(chatOpts);
  }

  /* Build chat HTML element */
  buildChat(opts) {

    let params = 'apikey=' + this._apiKey + '&authType=' + opts.config.authType;

    if (opts.config.authType === AuthType.DEV) {
      if (!opts.config.user || !opts.config.user.id || !opts.config.user.password) {
        console.error('User id and passoword must be defined when on DEV auth type');
        return;
      }
      var userAccount = {
        userIdentity: this._apiKey + '_' + opts.config.user.id,
        userPassword: btoa(opts.config.user.password),
        userName: opts.config.user.name,
        userEmail: opts.config.user.email,
        authType: opts.config.authType
      }
      _setToLocalStorage(Constants.USER_ACCOUNT_KEY, btoa(JSON.stringify(userAccount)), Constants.COOKIES_EXPIRATION)
    }

    //Chat iframe
    this.chatIframe = document.createElement('iframe');
    this.chatIframe.id = 'iframe-chat';
    this.chatIframe.src = Application.IFRAMEURL + '?' + params;
    window.addEventListener('message', _receiveUserFromCommon);

    let widgetMode = opts.window.target === undefined;

    if (widgetMode) {

      this.chatEl.innerHTML = ChatHeaderTemplate;
      this.chatEl.innerHTML += ChatFooterTemplate;
      this.chatEl.appendChild(this.chatIframe);

      this.chatEl.className = 'blip-hidden-chat';
      this.chatEl.className += ' fixed-window';

      this.chatIframe.width = 300;
      this.chatIframe.height = 460;

      //Set window config
      this._setWindowOptions(opts.window);

      let body = document.getElementsByTagName('body')[0];
      body.appendChild(this.chatEl);

      let closeBtn = document.getElementById('blip-close-btn');
      closeBtn.addEventListener('click', () => {
        if (this.chatEl.getAttribute('class').indexOf('blip-hidden-chat') == ! -1) {
          this.chatEl.setAttribute('class', 'blip-show-chat fixed-window');

          //Enter chat callback
          setTimeout(() => {
            opts.events.onEnter();
          }, 500);
        }
        else {
          this.chatEl.setAttribute('class', 'blip-hidden-chat fixed-window');

          //Leave chat callback
          setTimeout(() => {
            opts.events.onLeave();
          }, 500);
        }
      });

    } else {

      this.chatEl.className = 'target-window';
      this.chatEl.appendChild(this.chatIframe);

      this.chatIframe.className += ' target-window';
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
    this.chatEl.style.backgroundColor = color;
  }

  _sendMessage(message) {
    var postMessage = { code: Constants.SEND_MESSAGE_CODE, content: message }
    document.getElementById('iframe-chat').contentWindow.postMessage(message, Application.IFRAMEURL);
  }

}

function _parseOldOptionsFormat(opts, defaultOpts) {
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

function _getFromLocalStorage(name) {
  return localStorage.getItem(name);
}

function _setToLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

function _receiveUserFromCommon(event) {
  var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
  if (Application.IFRAMEURL.indexOf(origin) === -1) {
    return;
  }

  if (event.data.code === Constants.COOKIE_DATA_CODE) {
    _setToLocalStorage(Constants.USER_ACCOUNT_KEY, event.data.userAccount);
  }
  else if (event.data.code === Constants.REQUEST_COOKIE_CODE) {
    var iframe = document.getElementById('iframe-chat');
    var account = _getFromLocalStorage(Constants.USER_ACCOUNT_KEY);
    var message =
      {
        code: Constants.COOKIE_DATA_CODE,
        userAccount: account,
      };
    iframe.contentWindow.postMessage(message, Application.IFRAMEURL);
  }
}
