export default class Constants {
    static get USER_ACCOUNT_KEY() { return btoa('blipSdkUAccount'); }
    static get IFRAMEURL_LOCAL() { return 'http://localhost:3000/'; }
    static get IFRAMEURL_HMG() { return 'https://hmg-sdkcommon.blip.ai/'; }
    static get IFRAMEURL_PRD() { return 'https://sdkcommon.blip.ai/'; }
    static get SDK_DEFAULT_TITLE() { return 'Estamos online'; }
    static get SDK_DEFAULT_ICON_PATH() { return 'https://takenetomni.blob.core.windows.net/media-db/blip-app-white.png'; }
    static get SDK_DEFAULT_WIDGET_COLOR() { return '#546E7A'; }
    static get SDK_DEFAULT_Z_INDEX() { return 16000001; }
    static get SDK_DEFAULT_HIDE_MENU() { return false; }
    static get COOKIES_EXPIRATION() { return 365; }
    static get SEND_MESSAGE_CODE() { return 'SendMessage'; }
    static get REQUEST_POST_MESSAGE_CODE() { return 'RequestCookie'; }
    static get START_CONNECTION_CODE() { return 'BlipSdkStartConnection'; }
    static get COOKIE_DATA_CODE() { return 'BlipSdkCookieData'; }
    static get MENU_VISIBILITY_CODE() { return 'BlipSdkMenuVisibility'; }
    static get ACTION_SHOW_IMAGE_CODE() { return 'BlipSdkActionShowImage'; }
    static get ACTION_NOTIFY_MESSAGE_CODE() { return 'BlipSdkActionNotifyReceivedMessage'; }
}