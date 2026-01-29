import { Component, inject, OnInit, signal } from '@angular/core';
import { GlobalSpinner } from './shared/components/global-spinner/global-spinner';
import { RouterModule } from '@angular/router';
import { GlobalError } from './shared/components/global-error/global-error';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [GlobalSpinner, RouterModule, GlobalError],
})
export class App implements OnInit {
  protected readonly title = signal('task-management-dashboard');
  private readonly translateService = inject(TranslateService);
  ngOnInit(): void {
    this.langCheck();
  }
  langCheck() {
    const lang = localStorage.getItem('lang') ?? 'en';
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    const isEnglish = lang === 'en';
    document.body.classList.toggle('en', isEnglish);
    document.body.classList.toggle('ar', !isEnglish);
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
    document.body.lang = lang;
  }
}
