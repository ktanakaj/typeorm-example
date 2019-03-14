/**
 * ブログサービスモジュール。
 * @module ./app/blogs/blog.service
 */
import 'rxjs/add/operator/retry';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Blog } from './blog.model';

/**
 * ブログサービスクラス。
 */
@Injectable()
export class BlogService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * ブログ一覧を取得する。
	 * @param offset 検索開始位置。
	 * @param limit 検索件数。
	 * @returns ブログ一覧情報。
	 * @throws 通信エラーの場合。
	 */
	find(offset: number, limit: number): Promise<{ count: number, list: Blog[] }> {
		const params = new HttpParams()
			.set('offset', String(offset))
			.set('limit', String(limit));
		return this.http.get<{ count: number, list: Blog[] }>('/api/blogs/', { params })
			.retry(environment.maxRetry)
			.toPromise();
	}

	/**
	 * ブログを取得する。
	 * @param id ブログID。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	findById(id: number): Promise<Blog> {
		return this.http.get<Blog>('/api/blogs/' + id).retry(environment.maxRetry).toPromise();
	}

	/**
	 * ブログを登録する。
	 * @param blog ブログ情報。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	insert(blog: Blog): Promise<Blog> {
		return this.http.post<Blog>('/api/blogs/', blog).toPromise();
	}

	/**
	 * ブログを更新する。
	 * @param blog ブログ情報。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	update(blog: Blog): Promise<Blog> {
		return this.http.put<Blog>('/api/blogs/' + blog.id, blog).toPromise();
	}

	/**
	 * ブログを削除する。
	 * @param id ブログID。
	 * @returns ブログ情報。
	 * @throws 通信エラーの場合。
	 */
	delete(id: number): Promise<Blog> {
		return this.http.delete<Blog>('/api/blogs/' + id).toPromise();
	}
}
