import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi, type Mock } from 'vitest';
import { environment } from '../../../../environments/environment';
import { HttpClientService } from './http-client.service';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpClientMock: { get: Mock; post: Mock; put: Mock; delete: Mock };

  beforeEach(() => {
    httpClientMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [HttpClientService, { provide: HttpClient, useValue: httpClientMock }],
    });

    service = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fullRequestURL', () => {
    it('should return full URL with string resource', () => {
      const resource = 'users';
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      const result = service.fullRequestURL(resource);

      expect(result).toBe(expectedUrl);
    });

    it('should return full URL with numeric resource', () => {
      const resource = 123;
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      const result = service.fullRequestURL(resource);

      expect(result).toBe(expectedUrl);
    });
  });

  describe('get', () => {
    it('should make GET request without parameters', () => {
      const resource = 'users';
      const mockResponse = [{ id: 1, name: 'John' }];
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.get(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should make GET request with parameters', () => {
      const resource = 'users';
      const params = { page: 1, limit: 10 };
      const mockResponse = [{ id: 1, name: 'John' }];
      const expectedUrl = `${environment.apiUrl}/${resource}?page=1&limit=10&`;

      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.get(resource, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle numeric resource with parameters', () => {
      const resource = 123;
      const params = { active: true };
      const mockResponse = { id: 123, name: 'Test' };
      const expectedUrl = `${environment.apiUrl}/123?active=true&`;

      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.get(resource, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('post', () => {
    it('should make POST request without parameters', () => {
      const resource = 'users';
      const body = { name: 'John', email: 'john@test.com' };
      const mockResponse = { id: 1, ...body };
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.post(resource, body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, body);
    });

    it('should make POST request with parameters', () => {
      const resource = 'users';
      const body = { name: 'John', email: 'john@test.com' };
      const params = { validate: true };
      const mockResponse = { id: 1, ...body };
      const expectedUrl = `${environment.apiUrl}/${resource}?validate=true&`;

      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.post(resource, body, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, body);
    });

    it('should use empty body as default', () => {
      const resource = 'users';
      const mockResponse = { id: 1 };
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.post(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, {});
    });
  });

  describe('put', () => {
    it('should make PUT request without parameters', () => {
      const resource = 'users/1';
      const body = { name: 'John Updated' };
      const mockResponse = { id: 1, ...body };
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.put.mockReturnValue(of(mockResponse));

      service.put(resource, body).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, body);
    });

    it('should make PUT request with parameters', () => {
      const resource = 'users/1';
      const body = { name: 'John Updated' };
      const params = { partial: true };
      const mockResponse = { id: 1, ...body };
      const expectedUrl = `${environment.apiUrl}/${resource}?partial=true&`;

      httpClientMock.put.mockReturnValue(of(mockResponse));

      service.put(resource, body, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, body);
    });

    it('should use empty body as default', () => {
      const resource = 'users/1';
      const mockResponse = { id: 1 };
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.put.mockReturnValue(of(mockResponse));

      service.put(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, {});
    });
  });

  describe('delete', () => {
    it('should make DELETE request without parameters', () => {
      const resource = 'users/1';
      const mockResponse = { success: true };
      const expectedUrl = `${environment.apiUrl}/${resource}`;

      httpClientMock.delete.mockReturnValue(of(mockResponse));

      service.delete(resource).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should make DELETE request with parameters', () => {
      const resource = 'users/1';
      const params = { force: true };
      const mockResponse = { success: true };
      const expectedUrl = `${environment.apiUrl}/${resource}?force=true&`;

      httpClientMock.delete.mockReturnValue(of(mockResponse));

      service.delete(resource, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.delete).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('private method: getArgs', () => {
    it('should return empty string for null options', () => {
      const result = (service as unknown as { getArgs: (options: unknown) => string }).getArgs(
        null,
      );
      expect(result).toBe('');
    });

    it('should return empty string for undefined options', () => {
      const result = (service as unknown as { getArgs: (options: unknown) => string }).getArgs(
        undefined,
      );
      expect(result).toBe('');
    });

    it('should build query string from simple object', () => {
      const options = { page: 1, limit: 10 };
      const result = (service as unknown as { getArgs: (options: unknown) => string }).getArgs(
        options,
      );
      expect(result).toBe('?page=1&limit=10&');
    });

    it('should handle mixed data types', () => {
      const options = {
        active: true,
        count: 5,
        name: 'test',
        nullValue: null,
        undefinedValue: undefined,
      };
      const result = (service as unknown as { getArgs: (options: unknown) => string }).getArgs(
        options,
      );
      expect(result).toBe('?active=true&count=5&name=test&');
    });
  });

  describe('private method: optionToString', () => {
    it('should return empty string for null value', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('key', null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined value', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('key', undefined);
      expect(result).toBe('');
    });

    it('should handle primitive values', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('key', 'value');
      expect(result).toBe('key=value&');
    });

    it('should handle array values', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('tags', ['tag1', 'tag2', 'tag3']);
      expect(result).toBe('tags[0]=tag1&tags[1]=tag2&tags[2]=tag3&');
    });

    it('should handle empty array', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('tags', []);
      expect(result).toBe('');
    });

    it('should handle object values', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('filter', { status: 'active', type: 'user' });
      expect(result).toBe(
        'filter[status][0]=a&filter[status][1]=c&filter[status][2]=t&filter[status][3]=i&filter[status][4]=v&filter[status][5]=e&filter[type][0]=u&filter[type][1]=s&filter[type][2]=e&filter[type][3]=r&',
      );
    });

    it('should handle empty object', () => {
      const result = (
        service as unknown as { optionToString: (key: string, value: unknown) => string }
      ).optionToString('filter', {});
      expect(result).toBe('');
    });
  });

  describe('private method: serializeObject', () => {
    it('should handle nested objects', () => {
      const obj = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
      };
      const result = (
        service as unknown as { serializeObject: (obj: object, parentSerialized: string) => string }
      ).serializeObject(obj, 'data');
      expect(result).toBe('data[user][name]=John&data[user][age]=30&data[settings][theme]=dark&');
    });

    it('should handle deeply nested objects', () => {
      const obj = {
        user: {
          profile: {
            name: 'John',
            contact: { email: 'john@test.com' },
          },
        },
      };
      const result = (
        service as unknown as { serializeObject: (obj: object, parentSerialized: string) => string }
      ).serializeObject(obj, 'data');
      expect(result).toBe(
        'data[user][profile][name]=John&data[user][profile][contact][email]=john@test.com&',
      );
    });

    it('should handle mixed nested structure', () => {
      const obj = {
        id: 1,
        user: { name: 'John' },
        tags: ['tag1', 'tag2'],
      };
      const result = (
        service as unknown as { serializeObject: (obj: object, parentSerialized: string) => string }
      ).serializeObject(obj, 'data');
      expect(result).toBe(
        'data[id]=1&data[user][name]=John&data[tags][0]=tag1&data[tags][1]=tag2&',
      );
    });
  });

  describe('complex parameter scenarios', () => {
    it('should handle complex nested parameters in GET request', () => {
      const resource = 'search';
      const params = {
        filter: {
          status: 'active',
          category: {
            main: 'electronics',
            sub: 'phones',
          },
        },
        sort: ['name', '-date'],
        page: 1,
      };
      const mockResponse: unknown[] = [];
      const expectedUrl = `${environment.apiUrl}/${resource}?filter[status][0]=a&filter[status][1]=c&filter[status][2]=t&filter[status][3]=i&filter[status][4]=v&filter[status][5]=e&filter[category][main]=electronics&filter[category][sub]=phones&sort[0]=name&sort[1]=-date&page=1&`;

      httpClientMock.get.mockReturnValue(of(mockResponse));

      service.get(resource, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle array of objects in POST request', () => {
      const resource = 'bulk';
      const body = { items: [] };
      const params = {
        data: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      };
      const mockResponse = { success: true };
      const expectedUrl = `${environment.apiUrl}/${resource}?data[0]=[object Object]&data[1]=[object Object]&`;

      httpClientMock.post.mockReturnValue(of(mockResponse));

      service.post(resource, body, params).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientMock.post).toHaveBeenCalledWith(expectedUrl, body);
    });
  });
});
