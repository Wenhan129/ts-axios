import { isDate, isObject } from './utils';

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

export function buildUrl(url: string, params?: any): string {
  if (!params) return url;

  // * Use a parts list to compose a url string by join method
  const parts: string[] = [];

  // * Use Object.keys and forEach to loop over the keys of the object
  Object.keys(params).forEach(key => {
    const val = params[key];
    if (val === null || typeof val === 'undefined') {
      return;
    }
    // * As a temp array, to store all the properties
    // * Will loop over all the values in the array later
    let values = [];
    if (Array.isArray(val)) {
      // * If it is an array, just put it into values[]
      // * and add '[]' to the key
      // * '/base/get?foo[]=bar&foo[]=baz'
      values = val;
      key += '[]';
    } else {
      // * Push all other types of values into values[]
      values = [val];
    }
    values.forEach(val => {
      if (isDate(val)) {
        // * Shout out to typescript`is` keyword!
        val = val.toISOString();
      } else if (isObject(val)) {
        val = JSON.stringify(val);
      }
      // * "@、:、$、,、、[、]" are allowed in url
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  let serializedParams = parts.join('&');

  if (serializedParams) {
    // * Discard the hash value in url
    // * url: '/base/get#hash' => '/base/get'
    const markIndex = url.indexOf('#');
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    // * url: '/base/get?foo=bar', => params => '/base/get?foo=bar&params
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}
