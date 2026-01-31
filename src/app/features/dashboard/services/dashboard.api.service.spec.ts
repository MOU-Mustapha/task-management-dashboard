import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { HttpClientService } from '../../../core/http/http-config/http-client.service';

const { httpResourceMock } = vi.hoisted(() => ({
  httpResourceMock: vi.fn(),
}));

vi.mock('@angular/common/http', async () => {
  const actual =
    await vi.importActual<typeof import('@angular/common/http')>('@angular/common/http');
  return {
    ...actual,
    httpResource: httpResourceMock,
  };
});

import { DashboardApiService } from './dashboard.api.service';

describe('DashboardApiService', () => {
  let service: DashboardApiService;
  let httpClientServiceMock: { fullRequestURL: Mock };

  beforeEach(() => {
    httpResourceMock.mockReset();

    httpClientServiceMock = {
      fullRequestURL: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardApiService,
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    });

    httpClientServiceMock.fullRequestURL.mockReturnValue('http://test/statistics');

    httpResourceMock.mockReturnValue({
      reload: vi.fn(),
    });

    service = TestBed.inject(DashboardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create statisticsResource with URL from HttpClientService.fullRequestURL', () => {
    expect(httpResourceMock).toHaveBeenCalledTimes(1);

    const [urlFactory, options] = httpResourceMock.mock.calls[0];

    expect(typeof urlFactory).toBe('function');
    expect(urlFactory()).toBe('http://test/statistics');

    expect(httpClientServiceMock.fullRequestURL).toHaveBeenCalledWith('statistics');
    expect(options).toEqual({ defaultValue: [] });
  });

  it('reloadStatistics should call statisticsResource.reload', () => {
    const reloadSpy = (service.statisticsResource as unknown as { reload: Mock }).reload;

    service.reloadStatistics();

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
