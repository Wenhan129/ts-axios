import { isPlainObject } from './utils';

export function normalizeHeadersName(headers: any, normalizedName: string): void {
  if (!headers) return;
  Object.keys(headers).map(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeadersName(headers, 'Content-Type');

  if (isPlainObject(data)) {
    headers['Content-Type'] = 'application/json;charset=utf-8';
  }

  return headers;
}

export function parseHeaders(headers: string): any {
  // Object.create(null) will create an object which is not in Object's prototype.
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':');
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    if (val) {
      val = val.trim();
    }
    parsed[key] = val;
  });

  return parsed;
}
