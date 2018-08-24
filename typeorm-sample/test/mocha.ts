/**
 * ユニットテストの初期化処理モジュール。
 * @module ./test/mocha
 */
import * as config from 'config';
import * as log4js from 'log4js';
import { createConnection, useContainer as useContainerForOrm } from "typeorm";
import { Container } from "typedi";
import { useContainer as useContainerForRouting } from "routing-controllers";

// ここにフックを入れると全テストの前に自動実行される
before(async function () {
	// ※ 初期化に時間がかかる場合は伸ばす
	this.timeout(10000);

	// 全テストの実行前に一度だけ必要な処理
	log4js.configure(config['log4js']);

	// TypeORM, TypeDIを初期化
	useContainerForOrm(Container);
	useContainerForRouting(Container);
	const options = Object.assign({}, config['database']);
	options['logging'] = [/*'query',*/ 'error'];
	options['entities'] = [
		__dirname + "/../src/entities/{*.ts,*.js}"
	];
	await createConnection(options);
});