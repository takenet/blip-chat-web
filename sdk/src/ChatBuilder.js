import Application from './Application';

export default class ChatBuilder {
  constructor() {
    this._application = new Application();
  }

  withApiKey(apiKey) {
    this._application._apiKey = apiKey;
    return this;
  }

  build(opts) {
    this._application.openBlipThread(opts);
  }
}
