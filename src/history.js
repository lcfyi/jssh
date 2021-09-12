const HISTORY_KEY = "history";

export default class History {
  constructor() {
    // Not private or class field since we don't have babel loader
    let history = localStorage.getItem(HISTORY_KEY);
    if (!history) {
      history = [];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } else {
      history = JSON.parse(history);
    }
    this.history = history;
    this.index = history.length;
  }

  pushItem(value) {
    this.history.push(value);
    this.index = this.history.length;
    sync(this);
  }

  arrowUp() {
    if (this.index > 0) {
      this.index--;
    }
    return safeReturn(this);
  }

  arrowDown() {
    if (this.index < this.history.length) {
      this.index++;
    }
    return safeReturn(this);
  }

  /**
   * Get a suggestion from history based on the given prefix.
   * @param {String} prefix
   * @returns suggestion matching prefix, or empty string
   */
  getSuggestion(prefix) {
    // TODO make this more efficient
    if (prefix) {
      for (let i = this.history.length - 1; i >= 0; i--) {
        if (this.history[i].startsWith(prefix)) {
          return this.history[i];
        }
      }
    }
    return "";
  }

  resetIndex() {
    this.index = this.history.length;
  }

  resetHistory() {
    this.history = [];
    this.index = 0;
    sync(this);
  }
}

/**
 * Safe return function.
 * @param {History} history
 */
function safeReturn(history) {
  return history.history[history.index] ? history.history[history.index] : "";
}

/**
 * Sync to local storage.
 * @param {History} history
 */
function sync(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.history));
}
