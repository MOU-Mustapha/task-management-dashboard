import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private readonly http: HttpClient = inject(HttpClient);
  fullRequestURL(resource: string | number): string {
    return environment.apiUrl + resource;
  }
  get<T>(resource: string | number, params?: { [key: string]: unknown }): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.get<T>(this.fullRequestURL(resource));
  }
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
  delete<T>(resource: string | number, params?: { [key: string]: unknown }): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.delete<T>(this.fullRequestURL(resource));
  }

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
