import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  themeService = inject(ThemeService);
  isMobile =
    typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent || '');
  showMobileNotice = this.isMobile;

  closeMobileNotice() {
    this.showMobileNotice = false;
  }
}
