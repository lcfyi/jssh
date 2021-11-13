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
    this.historyTrie = new TrieNode();

    for (const historyElement of this.history) {
      this.historyTrie.addString(historyElement);
    }
  }

  pushItem(value) {
    this.history.push(value);
    this.historyTrie.addString(value);
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
    if (prefix) {
      return this.historyTrie.search(prefix);
    } else {
      return "";
    }
  }

  /**
   * Get a suggestion from history using a naive reverse iteration
   * of the entire history of this application.
   * @param {String} prefix
   * @returns suggestion matching prefix, or empty string
   */
  naiveGetSuggestion(prefix) {
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
 * Append-only, purpose-built trie to speed up our history search.
 *
 * Note that, while this trie would speed up the back-search, it actually
 * performs worse on average based on the use of the application since it's
 * very likely that common commands are at the end of the history list so
 * a naive iteration would be faster than traversing the trie and rebuilding
 * the string. This was confirmed with jsbench.
 *
 * However, a trie would cap the worst-case for our history search to the depth
 * of the trie, so it'll help average out the runtime complexity.
 * 
 * The trie will return a suggestion based on the latest characters added to
 * that particular path using the addString method.
 */
class TrieNode {
  constructor() {
    this.children = new Map();
    this.latestCharacter = null;
  }

  addString(string, index = 0) {
    if (index < string.length) {
      const firstChar = string.charAt(index);
      if (!this.children.has(firstChar)) {
        this.children.set(firstChar, new TrieNode());
      }
      this.latestCharacter = firstChar;
      this.children.get(firstChar).addString(string, index + 1);
    }
  }

  search(prefix, index = 0) {
    let firstChar =
      index < prefix.length ? prefix.charAt(index) : this.latestCharacter;
    if (this.children.has(firstChar)) {
      return firstChar + this.children.get(firstChar).search(prefix, index + 1);
    } else {
      return "";
    }
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
