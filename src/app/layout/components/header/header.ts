import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly translateService = inject(TranslateService);
  toggleLang() {
    const nextLang = this.translateService.getCurrentLang() === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', nextLang);
    this.translateService.use(nextLang);
    const isEnglish = nextLang === 'en';
    document.body.classList.toggle('en', isEnglish);
    document.body.classList.toggle('ar', !isEnglish);
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
    document.documentElement.lang = nextLang;
    document.body.lang = nextLang;
  }
}
