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
