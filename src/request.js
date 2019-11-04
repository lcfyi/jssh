/**
 *
 * @param {XMLHttpRequest} xhr
 * @param {Number} timeout
 * @param {String} body
 */
const request = (xhr, timeout, body) => {
  return new Promise((resolve, reject) => {
    if (timeout) {
      xhr.ontimeout = () => {
        reject("Timed out.");
      };
      xhr.timeout = timeout;
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      }
    };
    xhr.send(body);
  });
};

export default request;
