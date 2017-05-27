/**
 * @file TypeORMブログサンプルルートコンポーネント。
 */
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import browserHelper from './core/browser-helper';

/**
 * TypeORMブログサンプルルートコンポーネントクラス。
 */
@Component({
	selector: 'app-root',
	templateUrl: 'app/app.component.html',
})
export class AppComponent {
	/** メニューの折り畳み状態 */
	isCollapsed = true;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 国際化サービス。
	 */
	constructor(
		private translate: TranslateService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	async ngOnInit(): Promise<void> {
		// アプリで使用する言語を設定
		this.translate.setDefaultLang('en');
		this.translate.use(browserHelper.getLanguage());
	}
}
