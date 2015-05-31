export const testUrl = 'https://incandescent-torch-3438.firebaseio.com/test.json';

export function ajax(url: string, options: any = {}) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    function fail() {
      if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
        reject(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.responseText);
      }
    }

    function ok() {
      if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        resolve(xhr.responseText);
      }
    }

    xhr.addEventListener('abort', fail);
    xhr.addEventListener('error', fail);
    xhr.addEventListener('timeout', fail);
    xhr.addEventListener('load', ok);

    if (options.onprogress) xhr.addEventListener('progress', options.onprogress);

    xhr.open(options.method || 'GET', url, true, options.username || null, options.password || null);
    xhr.send(options.data || null);
  });
}

export function randomString(): string {
  return (Math.random() * Math.pow(10, 16)).toString(36);
}
