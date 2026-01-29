import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly modules = [
    { name: 'Dashboard', route: '/', icon: 'assets/icons/dashboard.png' },
    { name: 'Tasks', route: '/tasks', icon: 'assets/icons/tasks.png' },
    { name: 'Calendar', route: '/calendar', icon: 'assets/icons/calendar.png' },
    { name: 'Analytics', route: '/analytics', icon: 'assets/icons/analytics.png' },
    { name: 'Team', route: '/team', icon: 'assets/icons/team.png' },
    { name: 'Settings', route: '/settings', icon: 'assets/icons/settings.png' },
  ];
}
