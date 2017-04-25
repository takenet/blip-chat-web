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
      title: 'Estamos online',
      zIndex: 16000001,
      widgetColor: '#546E7A',
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

      let isMobile = _isMobile(navigator.userAgent || navigator.vendor || window.opera);

      if (isMobile) {
        this.chatIframe.width = window.innerWidth;
        this.chatIframe.height = window.innerHeight - 60;
        this.chatEl.setAttribute('class', 'blip-hidden-chat mobile-closed-fixed-window');       
      } else {
        this.chatIframe.width = 300;
        this.chatIframe.height = 460;
      }

      //Set window config
      this._setWindowOptions(opts.window);

      let body = document.getElementsByTagName('body')[0];
      body.appendChild(this.chatEl);

      let closeBtn = document.getElementById('blip-close-btn');
      closeBtn.addEventListener('click', () => {
        if (this.chatEl.getAttribute('class').indexOf('blip-hidden-chat') == ! -1) {

          if (isMobile) {
            this.chatEl.setAttribute('class', 'blip-show-chat mobile-open-fixed-window');
            document.getElementsByClassName('blip-minimize')[0].style.visibility = "visible";
          } else {
            this.chatEl.setAttribute('class', 'blip-show-chat fixed-window');
          }

          //Enter chat callback
          setTimeout(() => {
            opts.events.onEnter();
          }, 500);
        }
        else {

          if (isMobile) {
            this.chatEl.setAttribute('class', 'blip-hidden-chat mobile-closed-fixed-window');
            document.getElementsByClassName('blip-minimize')[0].style.visibility = "hidden";
          } else {
            this.chatEl.setAttribute('class', 'blip-hidden-chat fixed-window');
          }

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
    this._setZIndex(windowOpts.zIndex);
    this._setWidgetColor(windowOpts.widgetColor);
  }

  _setChatTitle(title) {
    let chatTitle = title ? title : Constants.SDK_DEFAULT_TITLE;
    this.chatEl.querySelector('#chat-header-text').innerHTML = chatTitle;
  }

  _setZIndex(value) {
    let zIndex = value ? value : 16000001;
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
      zIndex: opts.zIndex || defaultOpts.window.zIndex
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

function _isMobile(a) {
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
    return true;

  return false;
}
