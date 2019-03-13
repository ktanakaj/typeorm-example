/**
 * アプリのルートコンポーネント。
 * @module ./app/app.component
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import browserHelper from './core/browser-helper';

/**
 * アプリのルートコンポーネントクラス。
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 国際化サービス。
	 */
	constructor(
		private translate: TranslateService, ) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// アプリで使用する言語を設定
		this.translate.setDefaultLang('ja');
		this.translate.use(browserHelper.getLanguage());
	}
}
