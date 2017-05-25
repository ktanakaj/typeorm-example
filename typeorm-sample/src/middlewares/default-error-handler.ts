/**
 * デフォルトエラーハンドラー。
 * @module ./core/default-error-handler
 */
import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";
import * as log4js from 'log4js';
const logger = log4js.getLogger('error');

/**
 * デフォルトエラーハンドラークラス。
 */
@Middleware({ type: "after" })
export class DefaultErrorHandler implements ExpressErrorMiddlewareInterface {
	/**
	 * エラーハンドラー。
	 * @param error エラー。
	 * @param request リクエスト。
	 * @param response レスポンス。
	 * @param next 後続処理のコールバック。
	 */
	error(error: any, request: Request, response: Response, next: NextFunction) {
		// エラーの内容によってログ出力を制御する
		// ・バリデーションエラーなどサーバーとしては正常なものはエラーログに出さない
		// ・それ以外のサーバーのエラーや想定外のものはログに出す
		if (error instanceof HttpError) {
			if (error.httpCode < 500) {
				logger.debug(error.message);
				return next();
			}
		}
		logger.error(error);
		next();
	}
}