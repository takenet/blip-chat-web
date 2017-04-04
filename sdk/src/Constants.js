export default class Constants {
    static get USER_ACCOUNT_KEY() { return btoa('blipSdkUAccount'); }
    static get IFRAMEURL_LOCAL() { return 'http://localhost:3000/'; }
    static get IFRAMEURL_HMG() { return 'https://hmg-sdkcommon.blip.ai/'; }
    static get IFRAMEURL_PRD() { return 'https://sdkcommon.blip.ai/'; }
    static get COOKIE_DATA_CODE() { return 'BlipSdkCookieData'; }
    static get SEND_MESSAGE_CODE() { return 'SendMessage'; }
    static get SDK_DEFAULT_TITLE() { return 'Estamos online'; }
    static get REQUEST_COOKIE_CODE() { return 'RequestCookie'; }
    static get COOKIES_EXPIRATION() { return 365; }
}