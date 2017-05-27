/**
 * ブログサービスモジュール。
 * @module ./app/blogs/blog.service
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ResponseError } from '../core/response-error';
import { Blog } from './blog.model';

/** 通信失敗時のリトライ回数。 */
const MAX_RETRY = 3;

/**
 * ブログサービスクラス。
 */
@Injectable()
export class BlogService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: Http) { }

	/**
	 * ブログ一覧を取得する。
	 * @param offset 検索開始位置。
	 * @param limit 検索件数。
	 * @returns ブログ一覧情報。
	 * @throws 通信エラーの場合。
	 */
	find(offset: number, limit: number): Promise<{ count: number, list: Blog[] }> {
		return this.http.get('/api/blogs/', { params: {offset,  limit} })
			.retry(MAX_RETRY)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}

	/**
	 * ブログを取得する。
	 * @param id ブログID。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	findById(id: number): Promise<Blog> {
		return this.http.get('/api/blogs/' + id)
			.retry(MAX_RETRY)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}

	/**
	 * ブログを登録する。
	 * @param blog ブログ情報。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	insert(blog: Blog): Promise<Blog> {
		return this.http.post('/api/blogs/', blog)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}

	/**
	 * ブログを更新する。
	 * @param blog ブログ情報。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	update(blog: Blog): Promise<Blog> {
		return this.http.put('/api/blogs/' + blog.id, blog)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}

	/**
	 * ブログを削除する。
	 * @param id ブログID。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	delete(id: number): Promise<Blog> {
		return this.http.delete('/api/blogs/' + id)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}
}