import Application from './Application';

export default class ChatBuilder {
  constructor() {
    this._application = new Application();
  }

  withBotIdentifier(identifier) {
    this._application._apiKey = identifier;
    return this;
  }

  build(opts) {
    this._application.openBlipThread(opts);
  }

  destroy(){
    if (this._application) {
      this._application.destroy();
      this._application = null;
    }
  }

  sendMessage(message) {
    this._application._sendMessage(message);
  }
}
