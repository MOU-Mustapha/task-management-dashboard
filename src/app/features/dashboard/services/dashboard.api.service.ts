import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Statistic } from '../models/statistics.model';
import { HttpClientService } from '../../../core/http/http-config/http-client.service';

/**
 * Dashboard API service.
 *
 * Responsibilities:
 * - Provides access to dashboard-related endpoints
 * - Uses HttpClientService
 * - Wraps the statistics endpoint in an httpResource for reactive access
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly httpClientService = inject(HttpClientService);
  readonly statisticsResource = httpResource<Statistic[]>(
    () => this.httpClientService.fullRequestURL('statistics'),
    {
      defaultValue: [],
    },
  );
  reloadStatistics(): void {
    this.statisticsResource.reload();
  }
}
