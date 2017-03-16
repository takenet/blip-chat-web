import Style from './style.css';
import ChatTemplate from './chat.html';

export default class Application {
  constructor() {
    //Default options
    this.options = {
      title: 'Estamos online',
      onEnter: () => { },
      onLeave: () => { },
    }

    this.IFRAMEURL_HMG = 'https://hmg-sdkcommon.blip.ai/';
    this.IFRAMEURL_LOCAL = 'http://localhost:3000/';
    this.IFRAMEURL_PRD = 'https://sdkcommon.blip.ai/'
    this.IFRAMEURL = this.IFRAMEURL_LOCAL;

    if (process.env.NODE_ENV === 'homolog') {
      this.IFRAMEURL = this.IFRAMEURL_HMG;
    }
    else if (process.env.NODE_ENV === 'production') {
      this.IFRAMEURL = this.IFRAMEURL_PRD;
    }


    //Div element
    let chatEl = document.createElement('div');
    //Div ID and Class
    chatEl.id = 'take-chat';
    chatEl.innerHTML = ChatTemplate;
    this.chatEl = chatEl;

    //Chat iframe
    this.chatIframe = document.createElement('iframe');

    this.chatEl.appendChild(this.chatIframe);

  }

  /* Init chat and set values, style and cookies */
  openBlipThread(options) {
    let params = 'apikey=' + this._apiKey;
    let chatOpts = { ...this.options, ...options };

    this.chatIframe.src = this.IFRAMEURL + '?' + params;

    //Chat HTML element
    this.buildChat(chatOpts);
  }

  /* Build chat HTML element */
  buildChat(opts) {

    //Set chat title
    this._setChatTitle(opts.title);

    if (opts.target === undefined) {
      let body = document.getElementsByTagName('body')[0];
      body.appendChild(this.chatEl);

      this.chatEl.className = 'blip-hidden-chat';
      this.chatEl.className += ' fixed-window';

      this.chatIframe.width = 300;
      this.chatIframe.height = 460;

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

      this.chatEl.className += ' target-window';
      this.chatIframe.className += ' target-window';
      let chatTarget = document.getElementById(opts.target);

      chatTarget.appendChild(this.chatEl);
    }

  }

  destroy() {
    let body = document.getElementsByTagName('body')[0];
    body.removeChild(this.chatEl);
  }

  _setChatTitle(title) {
    let chatTitle = title ? title : 'Estamos online';
    this.chatEl.querySelector('#chat-header-text').innerHTML = chatTitle;
  }

  _sendMessage(message) {
    this.chatEl.querySelector('iframe').contentWindow.postMessage(message, '*');
  }
}
