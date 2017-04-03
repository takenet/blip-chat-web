import Style from './style.css';
import ChatHeaderTemplate from './chat-header.html';
import ChatFooterTemplate from './chat-footer.html';
import Constants from './Constants';

export default class Application {
  constructor() {
    //Default options
    this.options = {
      title: 'Estamos online',
      onEnter: () => { },
      onLeave: () => { },
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
  openBlipThread(options) {

    let chatOpts = { ...this.options, ...options };
    this.options = chatOpts;

    //Chat HTML element
    this.buildChat(chatOpts);
  }

  /* Build chat HTML element */
  buildChat(opts) {

    let params = 'apikey=' + this._apiKey;

    //Chat iframe
    this.chatIframe = document.createElement('iframe');
    this.chatIframe.id = 'iframe-chat';
    this.chatIframe.src = Application.IFRAMEURL + '?' + params;
    window.addEventListener('message', receiveUserFromCommmon);

    let widgetMode = opts.target === undefined;

    if (widgetMode) {

      this.chatEl.innerHTML = ChatHeaderTemplate;
      this.chatEl.innerHTML += ChatFooterTemplate;
      this.chatEl.appendChild(this.chatIframe);

      this.chatEl.className = 'blip-hidden-chat';
      this.chatEl.className += ' fixed-window';

      this.chatIframe.width = 300;
      this.chatIframe.height = 460;

      //Set zIndex
      this._setZIndex(opts.zIndex);

      //Set chat title
      this._setChatTitle(opts.title);

      let body = document.getElementsByTagName('body')[0];
      body.appendChild(this.chatEl);

      let closeBtn = document.getElementById('blip-close-btn');
      closeBtn.addEventListener('click', () => {
        if (this.chatEl.getAttribute('class').indexOf('blip-hidden-chat') == ! -1) {
          this.chatEl.setAttribute('class', 'blip-show-chat fixed-window');

          //Enter chat callback
          setTimeout(() => {
            opts.onEnter();
          }, 500);
        }
        else {
          this.chatEl.setAttribute('class', 'blip-hidden-chat fixed-window');

          //Leave chat callback
          setTimeout(() => {
            opts.onLeave();
          }, 500);
        }
      });

    } else {

      this.chatEl.className = 'target-window';
      this.chatEl.appendChild(this.chatIframe);

      this.chatIframe.className += ' target-window';
      let chatTarget = document.getElementById(opts.target);

      chatTarget.appendChild(this.chatEl);
    }

  }

  destroy() {
    if (this.options.target !== undefined) {
      let element = document.getElementById(this.options.target);
      element.removeChild(this.chatEl);
    } else {
      let body = document.getElementsByTagName('body')[0];
      body.removeChild(this.chatEl);
    }
  }

  _setChatTitle(title) {
    let chatTitle = title ? title : Constants.SDK_DEFAULT_TITLE;
    this.chatEl.querySelector('#chat-header-text').innerHTML = chatTitle;
  }

  _setZIndex(value) {
    let zIndex = value ? value : 16000001;
    this.chatEl.style.zIndex = zIndex;
  }

  _sendMessage(message) {
    var postMessage = { code: Constants.SEND_MESSAGE_CODE, content: message }
    document.getElementById('iframe-chat').contentWindow.postMessage(message, Application.IFRAMEURL);
  }
}

function getCookie(name) {
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      let value = c.substring(name.length + 1, c.length);
      setCookie(name, value, 365);
      return value;
    }
  }
  return null;
}

function setCookie(name, value, exdays) {
  var date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function receiveUserFromCommmon(event) {
  var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
  if (Application.IFRAMEURL.indexOf(origin) === -1) {
    return;
  }

  if (event.data.code === Constants.COOKIE_DATA_CODE) {
    setCookie(Constants.USER_ACCOUNT_KEY, event.data.userAccount, 365);
  }
  else if (event.data.code === Constants.REQUEST_COOKIE_CODE) {
    var iframe = document.getElementById('iframe-chat');
    var account = getCookie(Constants.USER_ACCOUNT_KEY);
    var message =
      {
        code: Constants.COOKIE_DATA_CODE,
        userAccount: account,
      };
    iframe.contentWindow.postMessage(message, Application.IFRAMEURL);
  }
}
