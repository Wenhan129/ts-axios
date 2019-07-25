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
}
