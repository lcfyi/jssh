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
    this.sync();
  }

  arrowUp() {
    if (this.index > 0) {
      this.index--;
      return this.history[this.index];
    } else if (this.history.length == 1) {
      return this.history[this.index];
    } else {
      return "";
    }
  }

  arrowDown() {
    if (this.index < this.history.length - 1) {
      this.index++;
      return this.history[this.index];
    } else {
      return "";
    }
  }

  resetIndex() {
    this.index = this.history.length;
  }

  resetHistory() {
    this.history = [];
    this.index = 0;
    this.sync();
  }

  sync() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
  }
}
