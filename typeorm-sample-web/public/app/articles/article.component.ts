/**
 * ブログ記事ページコンポーネント。
 * @module ./app/articles/article.component
 */
import 'rxjs/add/operator/filter';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Blog } from '../blogs/blog.model';
import { Article } from './article.model';
import { BlogService } from '../blogs/blog.service';
import { ArticleService } from './article.service';

interface ArticleForm extends Article {
	tag?: string;
}

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
	/** タグ */
	tag: string;
	/** ブログ記事一覧 */
	articles: Article[] = [];
	/** ブログ記事総数 */
	length: number;
	/** 選択中のページ */
	currentPage: number = 1;
	/** 1ページの表示件数 */
	pageMax: number = 10;
	/** ブログ記事フォーム */
	articleForm: ArticleForm;
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
	 */
	async ngOnInit(): Promise<void> {
		this.blog = await this.blogService.findById(this.route.snapshot.params['blogId']);
		this.route.queryParamMap
			.subscribe(async () => {
				this.tag = this.route.snapshot.queryParams["tag"];
				return await this.loadPage(this.currentPage);
			});
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
		const info = await this.articleService.find(this.blog.id, (page - 1) * this.pageMax, this.pageMax, this.tag);
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
		let article: Article = { blog: this.blog, tags: [] };
		if (id) {
			article = await this.articleService.findById(id);
		}
		this.articleForm = this.articleToForm(article);
		this.formModal.show();
	}

	/**
	 * ブログ記事を登録／更新する。
	 * @returns 処理状態。
	 */
	async submitForm(): Promise<void> {
		this.error = '';
		let article = this.formToArticle(this.articleForm);
		try {
			if (article.id) {
				await this.articleService.update(article);
			} else {
				await this.articleService.insert(article);
			}
			await this.loadPage(this.currentPage);
			this.closeForm();
		} catch (e) {
			if (e instanceof HttpErrorResponse) {
				this.error = e.error.message;
			} else {
				this.error = e.message || e;
			}
		}
	}

	/**
	 * 記事を記事フォームに変換する。
	 * @param article 記事。
	 * @returns 記事フォーム。
	 */
	private articleToForm(article: Article): ArticleForm {
		let form: ArticleForm = Object.assign({}, article);
		form.tag = article.tags.map((t) => t.tag).join(' ');
		return form;
	}

	/**
	 * 記事フォームを記事に変換する。
	 * @param form 記事フォーム。
	 * @returns 記事。
	 */
	private formToArticle(form: ArticleForm): Article {
		let article: Article = Object.assign({}, form);
		for (let tag of form.tag.split(' ')) {
			article.tags.push({ tag });
		}
		return article;
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
			if (e instanceof HttpErrorResponse) {
				this.error = e.error.message;
			} else {
				this.error = e.message || e;
			}
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