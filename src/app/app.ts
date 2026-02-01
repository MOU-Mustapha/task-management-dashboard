import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GlobalSpinner } from './shared/components/global-spinner/global-spinner';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Root application component.
 *
 * Responsibilities:
 * - Initializes application language and text direction on startup
 * - Includes global spinner component and router outlet
 *
 * Language handling:
 * - Reads language from localStorage or defaults to 'en'
 * - Sets translation service language
 * - Updates document body and HTML attributes for direction and lang
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [GlobalSpinner, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
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
