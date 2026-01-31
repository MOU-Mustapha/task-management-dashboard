import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
// Note: BrowserDynamicTestingModule and platformBrowserDynamicTesting are deprecated
// but are still the recommended approach for Vitest/Jest in Angular 21.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
