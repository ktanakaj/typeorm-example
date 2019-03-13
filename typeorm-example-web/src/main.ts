/**
 * @file アプリのブートローダー。
 */
import { enableProdMode } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

registerLocaleData(localeJa, 'ja');

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.log(err));
