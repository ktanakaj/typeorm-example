/**
 * アプリのページオブジェクト。
 * @module ./app.po
 */
import { browser, by, element } from 'protractor';

/**
 * アプリのページクラス。
 */
export class AppPage {
	navigateTo() {
		return browser.get('/');
	}

	getHeaderTitle() {
		return element(by.css('header .navbar-brand')).getText();
	}
}
