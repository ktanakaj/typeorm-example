/**
 * ユニットテストの初期化処理モジュール。
 * @module ./test/mocha
 */
import * as config from 'config';
import * as log4js from 'log4js';

// import { global, shardable } from '../models';

// ここにフックを入れると全テストの前に自動実行される
before(async function () {
	// 全テストの実行前に一度だけ必要な処理
	log4js.configure(config['log4js']);
});