/**
 * ブログ記事サービスモジュール。
 * @module ./app/articles/article.service
 */
import 'rxjs/add/operator/retry';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Article } from './article.model';
import { Tag } from './tag.model';

/** 通信失敗時のリトライ回数。 */
const MAX_RETRY = 3;

/**
 * ブログ記事サービスクラス。
 */
@Injectable()
export class ArticleService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * ブログ記事一覧を取得する。
	 * @param blogId ブログID。
	 * @param offset 検索開始位置。
	 * @param limit 検索件数。
	 * @returns ブログ記事一覧情報。
	 * @throws 通信エラーの場合。
	 */
	find(blogId: number, offset: number, limit: number, tag?: string): Promise<{ count: number, list: Article[] }> {
		let params = new HttpParams()
			.set('blogId', String(blogId))
			.set('offset', String(offset))
			.set('limit', String(limit));
		if (tag !== undefined && tag !== null && tag !== '') {
			params = params.set('tag', String(tag));
		}
		return this.http.get<{ count: number, list: Article[] }>('/api/articles/', { params })
			.retry(MAX_RETRY)
			.toPromise();
	}

	/**
	 * ブログ記事を取得する。
	 * @param id ブログ記事ID。
	 * @returns 記事情報。
	 * @throws 通信エラーの場合。
	 */
	findById(id: number): Promise<Article> {
		return this.http.get<Article>('/api/articles/' + id)
			.retry(MAX_RETRY)
			.toPromise();
	}

	/**
	 * ブログ記事を登録する。
	 * @param article 記事情報。
	 * @returns 記事情報。
	 * @throws 通信エラーの場合。
	 */
	insert(article: Article): Promise<Article> {
		return this.http.post<Article>('/api/articles/', article)
			.toPromise();
	}

	/**
	 * ブログ記事を更新する。
	 * @param article 記事情報。
	 * @returns 記事情報。
	 * @throws 通信エラーの場合。
	 */
	update(article: Article): Promise<Article> {
		return this.http.put<Article>('/api/articles/' + article.id, article)
			.toPromise();
	}

	/**
	 * ブログ記事を削除する。
	 * @param id ブログ記事ID。
	 * @returns 記事情報。
	 * @throws 通信エラーの場合。
	 */
	delete(id: number): Promise<Article> {
		return this.http.delete<Article>('/api/articles/' + id)
			.toPromise();
	}
}