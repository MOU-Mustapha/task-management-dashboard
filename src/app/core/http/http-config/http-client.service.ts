import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

/**
 * Lightweight HTTP wrapper around Angular HttpClient.
 *
 * Responsibilities:
 * - Prefixes all requests with the base API URL
 * - Supports GET, POST, PUT, DELETE
 * - Serializes query parameters (including nested objects and arrays)
 */
@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private readonly http: HttpClient = inject(HttpClient);
  /**
   * Builds the full API URL by prefixing the resource with the base apiUrl.
   */
  fullRequestURL(resource: string | number): string {
    return `${environment.apiUrl}/${resource}`;
  }
  /**
   * Performs an HTTP GET request.
   *
   * @param resource API endpoint path or identifier
   * @param params Optional query parameters (supports nested objects & arrays)
   */
  get<T>(resource: string | number, params?: { [key: string]: unknown }): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.get<T>(this.fullRequestURL(resource));
  }
  /**
   * Performs an HTTP POST request.
   *
   * @param resource API endpoint path or identifier
   * @param body The request body
   * @param params Optional query parameters (supports nested objects & arrays)
   */
  post<T>(
    resource: string | number,
    body: object = {},
    params?: { [key: string]: unknown },
  ): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.post<T>(this.fullRequestURL(resource), body);
  }
  /**
   * Performs an HTTP PUT request.
   *
   * @param resource API endpoint path or identifier
   * @param body The request body
   * @param params Optional query parameters (supports nested objects & arrays)
   */
  put<T>(
    resource: string | number,
    body: object = {},
    params?: { [key: string]: unknown },
  ): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.put<T>(this.fullRequestURL(resource), body);
  }
  /**
   * Performs an HTTP DELETE request.
   *
   * @param resource API endpoint path or identifier
   * @param params Optional query parameters (supports nested objects & arrays)
   */
  delete<T>(resource: string | number, params?: { [key: string]: unknown }): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.delete<T>(this.fullRequestURL(resource));
  }
  /**
   * Converts a params object into a query string.
   *
   * Example:
   * { page: 1, filter: { status: 'active' } }
   * → ?page=1&filter[status]=active
   */
  private getArgs(options: { [key: string]: unknown }): string {
    if (!options) {
      return '';
    }
    let args = '?';
    Object.keys(options).forEach((key) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }
  /**
   * Serializes a single query parameter into a query-string fragment.
   *
   * Supported value types:
   * - Primitive: key=value
   * - Array: key[0]=a&key[1]=b
   * - Object: key[subKey]=value (recursively)
   *
   * @param key Query parameter name
   * @param value Parameter value (primitive, array, or object)
   * @returns Serialized query-string fragment
   */
  private optionToString(key: string, value: unknown): string {
    if (value == null || value == undefined) {
      return '';
    }
    let str = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        str += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element: string) => {
        if (value instanceof Object) {
          str += this.serializeObject(
            (value as { [key: string]: unknown })[element] as {
              [key: string]: unknown;
            },
            `${key}[${element}]`,
          );
        } else {
          str += `${key}[${element}]=${value[element]}&`;
        }
      });
    } else {
      str += `${key}=${value}&`;
    }
    return str;
  }
  /**
   * Recursively serializes a nested object into query-string notation.
   *
   * Example:
   * serializeObject({ a: 1, b: { c: 2 } }, 'filter')
   * → filter[a]=1&filter[b][c]=2
   *
   * @param obj Object to serialize
   * @param parentSerialized Serialized parent key path
   */
  private serializeObject(obj: object, parentSerialized: string): string {
    let str = '';
    Object.keys(obj).forEach((key) => {
      const value = (obj as { [key: string]: unknown })[key];
      if (value instanceof Object) {
        str += this.serializeObject(value, `${parentSerialized}[${key}]`);
      } else {
        str += `${parentSerialized}[${key}]=${value}&`;
      }
    });
    return str;
  }
}
