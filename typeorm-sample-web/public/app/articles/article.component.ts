/**
 * ブログ記事ページコンポーネント。
 * @module ./app/articles/article.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Blog } from '../blogs/blog.model';
import { Article } from './article.model';
import { BlogService } from '../blogs/blog.service';
import { ArticleService } from './article.service';

/**
 * ブログ記事ページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/articles/article.component.html',
	providers: [BlogService, ArticleService],
})
export class ArticleComponent implements OnInit {
	/** ブログ */
	blog: Blog;
	/** ブログ記事一覧 */
	articles: Article[] = [];
	/** ブログ記事総数 */
	length: number;
	/** 選択中のページ */
	currentPage: number = 1;
	/** 1ページの表示件数 */
	pageMax: number = 10;
	/** ブログ記事フォーム */
	articleForm: Article;
	/** エラーメッセージ */
	error: string;
	/** ブログ記事編集モーダル */
	@ViewChild('formModal') public formModal: ModalDirective;
	/** ブログ記事削除確認モーダル */
	@ViewChild('deleteModal') public deleteModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param blogService ブログサービス。
	 * @param articleService ブログ記事サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private blogService: BlogService,
		private articleService: ArticleService) { }

	/**
	 * コンポーネント起動時の処理。
	 * @return 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		this.blog = await this.blogService.findById(this.route.snapshot.params['blogId']);
		return this.loadPage(this.currentPage);
	}

	/**
	 * ページ変更イベント。
	 * @param event ページ情報。
	 * @returns 処理状態。
	 */
	pageChanged(event: { page: number }): Promise<void> {
		return this.loadPage(event.page);
	}

	/**
	 * ブログ記事一覧を検索する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async loadPage(page: number): Promise<void> {
		const info = await this.articleService.find(this.blog.id, (page - 1) * this.pageMax, this.pageMax);
		this.length = info.count;
		this.articles = info.list;
	}

	/**
	 * ブログ記事編集フォームを開く。
	 * @param id ブログ記事ID。新規は無し。
	 * @returns 処理状態。
	 */
	async openForm(id: number = 0): Promise<void> {
		this.error = '';
		this.articleForm = { blog: this.blog, tags: [] };
		if (id) {
			this.articleForm = await this.articleService.findById(id);
		}
		this.formModal.show();
	}

	/**
	 * ブログ記事を登録／更新する。
	 * @returns 処理状態。
	 */
	async submitForm(): Promise<void> {
		this.error = '';
		try {
			if (this.articleForm.id) {
				await this.articleService.update(this.articleForm);
			} else {
				await this.articleService.insert(this.articleForm);
			}
			await this.loadPage(this.currentPage);
			this.closeForm();
		} catch (e) {
			this.error = e.message || e;
		}
	}

	/**
	 * ブログ記事編集フォームを閉じる。
	 */
	closeForm(): void {
		this.formModal.hide();
		this.articleForm = null;
	}

	/**
	 * 削除確認ダイアログを開く。
	 * @param id ブログID。 
	 * @returns 処理状態。
	 */
	async confirmDelete(id: number): Promise<void> {
		this.error = '';
		this.articleForm = await this.articleService.findById(id);
		this.deleteModal.show();
	}

	/**
	 * 削除を行う。
	 * @returns 処理状態。
	 */
	async delete(): Promise<void> {
		this.error = '';
		try {
			await this.articleService.delete(this.articleForm.id);
			await this.loadPage(this.currentPage);
			this.closeDelete();
		} catch (e) {
			this.error = e.message || e;
		}
	}

	/**
	 * 削除確認ダイアログを閉じる。
	 */
	closeDelete(): void {
		this.deleteModal.hide();
		this.articleForm = null;
	}
}