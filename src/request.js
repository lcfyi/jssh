/**
 *
 * @param {XMLHttpRequest} xhr
 * @param {Object} body
 */
const request = (xhr, body) => {
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve(xhr);
      } else if (xhr.status >= 401) {
        reject(xhr);
      }
    };
    xhr.send(body);
  });
};

export default request;
