/**
 * @file TypeORMサンプルサーバー起動スクリプト。
 */
import "reflect-metadata";
import * as path from 'path';
import * as config from 'config';
import * as log4js from 'log4js';
import 'source-map-support/register';
import { createConnection, useContainer as useContainerForOrm, ConnectionOptions } from "typeorm";
import { Container } from "typedi";
import { createExpressServer, useContainer as useContainerForRouting } from "routing-controllers";
import fileUtils from './core/file-utils';
const packagejson = require('../package.json');

// log4jsを初期設定
log4js.configure(config['log4js']);

// TypeORM, TypeDIを初期化
useContainerForOrm(Container);
useContainerForRouting(Container);
const options = Object.assign({}, config['database']);
options['logging'] = ['query', 'error'];
options['entities'] = [
	__dirname + "/entities/{*.ts,*.js}"
];
createConnection(options).then(() => {
	// Expressサーバー作成
	const app = createExpressServer({
		routePrefix: "/api",
		controllers: [__dirname + "/controllers/*.js"],
		middlewares: [__dirname + "/middlewares/*.js"],
	});

	// log4jsでアクセスログ出力設定
	app.use(log4js.connectLogger(log4js.getLogger('access'), {
		level: 'auto',
		nolog: config['noaccesslog'],
	}));

	// API検証用のswagger設定
	if (app.get('env') === 'development') {
		app.get('/api-docs.json', handleSwaggerApi);
	}

	// サーバー起動完了
	app.listen(process.env.PORT || 3000);
	log4js.getLogger('debug').info(`${packagejson['name']}@${packagejson['version']} started`);
}).catch((e) => log4js.getLogger('error').error(e));

/**
 * Swagger JSDocのリクエストを処理する。
 * @param req HTTPリクエスト。
 * @param res HTTPレスポンス。
 */
function handleSwaggerApi(req, res): void {
	const swaggerSpec = makeSwaggerSpec('controllers');
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
}

/**
 * Swagger JSDocのJSONを生成する。
 * @param dir ドキュメントが記載されているソースのルートパス。
 * @returns JSONドキュメント。
 */
function makeSwaggerSpec(dir: string): any {
	const swaggerJSDoc = require('swagger-jsdoc');

	let controllers = [];
	fileUtils.directoryWalkRecursiveSync(
		path.join(__dirname, dir),
		(realpath) => {
			if (/\.js$/.test(realpath)) {
				controllers.push(realpath);
			}
		});

	return swaggerJSDoc({
		swaggerDefinition: config['swagger'],
		apis: controllers,
	});
}