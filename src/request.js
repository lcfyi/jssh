/**
 * Wrapper for XHR to send requests.
 * @param {String} url
 * @param {Object} options parameters include timeout,
 * method, headers, body, and hideCors
 */
const request = (url, options) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      throw new Error("Invalid parameters to request.");
    }
    let timeout = options.timeout || 0;
    let method = options.method || "GET";
    let headers = options.headers || {};
    let body = options.body || undefined;

    if (options.hideCors) {
      url = `https://cors-anywhere.herokuapp.com/${url}`;
    }

    // Use XMLHttpRequest instead of fetch so we have timeout
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (let header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
    xhr.timeout = timeout;
    xhr.ontimeout = () => {
      reject("Timed out.");
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.responseText);
        }
      }
    };
    xhr.send(body);
  });
};

export default request;
