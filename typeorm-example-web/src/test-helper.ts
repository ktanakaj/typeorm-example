/**
 * ユニットテスト補助用の共通処理。
 * @module ./test-helper
 */
import { Observable, of } from 'rxjs';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';

/** JSONファイルを使用するローカライズファイルローダー */
class JsonTranslationLoader implements TranslateLoader {
	getTranslation(code: string = ''): Observable<object> {
		const c = code.toLowerCase();
		return of(require(__dirname + '/assets/i18n/' + c + '.json'));
	}
}

/** アプリ共通のモジュール群 */
const commonModuleDef = {
	imports: [
		HttpClientTestingModule,
		RouterTestingModule,
		FormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: JsonTranslationLoader,
			}
		}),
		CollapseModule.forRoot(),
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
	],
	providers: [
		TranslateService,
	],
	declarations: [
	],
};

/**
 * アプリ共通のモジュールロード等を追加したTestBed.configureTestingModule。
 * @param moduleDef configureTestingModuleに渡すパラメータ。
 * @returns configureTestingModuleの戻り値。
 */
function configureTestingModule(moduleDef: TestModuleMetadata): typeof TestBed {
	for (const key of ['imports', 'providers', 'declarations']) {
		moduleDef[key] = moduleDef[key] || [];
		for (const o of commonModuleDef[key]) {
			if (!moduleDef[key].includes(o)) {
				moduleDef[key].push(o);
			}
		}
	}
	return TestBed.configureTestingModule(moduleDef);
}

export default {
	configureTestingModule,
};
