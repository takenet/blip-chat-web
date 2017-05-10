class ApplicationStorage {
    _getFromLocalStorage(name) {
        if (this._supportsLocalStorage()) {
            return localStorage.getItem(name);
        } else {
            return null;
        }
    }

    _setToLocalStorage(name, value) {
        if (this._supportsLocalStorage()) {
            localStorage.setItem(name, value);
        }
    }

    _supportsLocalStorage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }
}

export default ApplicationStorage;
