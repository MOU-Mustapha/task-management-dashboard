import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterModule } from '@angular/router';

/**
 * Layout Component
 *
 * Responsibilities:
 * - Serves as the main structural layout of the application.
 * - Provides a consistent UI skeleton with a fixed Header and Sidebar.
 * - Contains a router outlet area where different pages/components are rendered.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterModule, Header, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
