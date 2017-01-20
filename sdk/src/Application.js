import Style from './style.css';
import ChatTemplate from './chat.html';

export default class Application {
  constructor() {
    this.APIURL = 'https://api.0mn.io/partners';

    this.IFRAMEURL_HMG = 'https://hmg-blip-sdk.azurewebsites.net/chat';
    this.IFRAMEURL_LOCAL = 'http://localhost:3000/chat';
    this.IFRAMEURL_PRD = 'https://blip-sdk.azurewebsites.net/chat'
    this.IFRAMEURL = this.IFRAMEURL_LOCAL;

    if (process.env.NODE_ENV === 'homolog') {
      this.IFRAMEURL = this.IFRAMEURL_HMG;
    }
    else if (process.env.NODE_ENV === 'production') {
      this.IFRAMEURL = this.IFRAMEURL_PRD;
    }
  }

  /* Init chat and set values, style and cookies */
  openBlipThread(opts) {
    let params = 'apikey=' + this._apiKey;

    //Chat HTML element
    this.buildChat(params, opts);
  }

  /* Build chat HTML element */
  buildChat(params, opts) {
    let body = document.getElementsByTagName('body')[0];
    //Div element
    let chatEl = document.createElement('div');

    //Div ID and Class
    chatEl.id = 'take-chat';
    chatEl.className = 'blip-hidden-chat';
    chatEl.innerHTML = ChatTemplate;

    this.chatEl = chatEl;
    body.appendChild(this.chatEl);

    //Set chat title
    this._setChatTitle(opts.title);

    //Chat iframe
    let chatIframe = document.createElement('iframe');
    chatIframe.width = 290;
    chatIframe.height = 400;
    chatIframe.src = this.IFRAMEURL + '?' + params;

    chatEl.appendChild(chatIframe);

    let closeBtn = document.getElementById('blip-close-btn');
    closeBtn.addEventListener('click', () => {
      if (chatEl.getAttribute('class') == 'blip-hidden-chat') {
        chatEl.setAttribute('class', 'blip-show-chat');

        //Enter chat callback
        setTimeout(() => {
          opts.onEnter();
        }, 500);
      }
      else {
        chatEl.setAttribute('class', 'blip-hidden-chat');

        //Leave chat callback
        setTimeout(() => {
          opts.onLeave();
        }, 500);
      }
    });
  }

  _setChatTitle(title) {
    let chatTitle = title ? title : 'Estamos online';
    this.chatEl.querySelector('#chat-header-text').innerHTML = chatTitle;
  }
}
