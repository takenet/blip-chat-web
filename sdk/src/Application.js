import Style from './style.css';
import ChatTemplate from './chat.html';


//Teste
export default class Application {
  constructor() {
    this.APIURL = 'https://api.0mn.io/partners';

    this.IFRAMEURL_HMG = 'https://hmg-blip-sdk.azurewebsites.net/chat';
    this.IFRAMEURL_LOCAL = 'http://localhost:3000/chat';
    this.IFRAMEURL_PRD = 'https://blip-sdk.azurewebsites.net/chat'
    this.IFRAMEURL = this.IFRAMEURL_LOCAL;

    if (process.env.NODE_ENV === 'homolog') {
      this.IFRAMEURL = this.IFRAMEURL_HMG;
    } else if (process.env.NODE_ENV === 'production') {
      this.IFRAMEURL = this.IFRAMEURL_PRD;
    }

  }

  /* Init chat and set values, style and cookies */
  openBlipThread() {
    let params = 'apikey=' + this._apiKey;

    //Chat HTML element
    this.buildChat(params);
  }

  /* Build chat HTML element */
  buildChat(params) {
    let body = document.getElementsByTagName('body')[0];
    //Div element
    let chatDiv = document.createElement('div');

    //Div ID and Class
    chatDiv.id = 'take-chat';
    chatDiv.className = 'blip-hidden-chat';
    chatDiv.innerHTML = ChatTemplate;

    body.appendChild(chatDiv);

    //Chat iframe
    let chatIframe = document.createElement('iframe');
    chatIframe.width = 290;
    chatIframe.height = 400;
    chatIframe.src = this.IFRAMEURL + '?' + params;

    chatDiv.appendChild(chatIframe);

    let closeBtn = document.getElementById('blip-close-btn');
    closeBtn.addEventListener('click', () => {
      if (chatDiv.getAttribute('class') == 'blip-hidden-chat') {
        chatDiv.setAttribute('class', 'blip-show-chat');
      }
      else {
        chatDiv.setAttribute('class', 'blip-hidden-chat');
      }
    });
  }
}
