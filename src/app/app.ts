import { Component, signal } from '@angular/core';
import { GlobalSpinner } from './shared/components/global-spinner/global-spinner';
import { RouterModule } from '@angular/router';
import { GlobalError } from './shared/components/global-error/global-error';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [GlobalSpinner, RouterModule, GlobalError],
})
export class App {
  protected readonly title = signal('task-management-dashboard');
}
