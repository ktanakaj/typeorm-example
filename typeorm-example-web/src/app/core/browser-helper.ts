/**
 * ブラウザ関連のヘルパーモジュール。
 * @module ./app/core/browser-helper
 */

/**
 * ページの言語設定を取得する。
 * @returns 2文字の言語コード。
 */
function getLanguage(): string {
	return getLocale().substr(0, 2);
}

/**
 * ブラウザのロケールを取得する。
 * @returns ロケールコード。
 */
function getLocale(): string {
	// 取得失敗時はデフォルトとしてアメリカを返す
	try {
		return navigator.language;
	} catch (e) {
		return 'en-US';
	}
}

/**
 * ページをリダイレクトする。
 * @param url URL。
 */
function redirect(url: string): void {
	// ※ ブラウザの素のリダイレクト。Angular2のルートは呼ばれない
	window.location.href = url;
}

export default {
	getLanguage,
	getLocale,
	redirect,
};
