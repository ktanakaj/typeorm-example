/**
 * ブログページコンポーネント。
 * @module ./app/blogs/blog.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';

/**
 * ブログページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/blogs/blog.component.html',
	providers: [BlogService],
})
export class BlogComponent implements OnInit {
	/** ブログ一覧 */
	blogs: Blog[] = [];
	/** ブログ総数 */
	length: number;
	/** 選択中のページ */
	currentPage: number = 1;
	/** 1ページの表示件数 */
	pageMax: number = 10;
	/** ブログ情報フォーム */
	blogForm: Blog;
	/** エラーメッセージ */
	error: string;
	/** ブログ編集モーダル */
	@ViewChild('formModal') public formModal: ModalDirective;
	/** ブログ削除確認モーダル */
	@ViewChild('deleteModal') public deleteModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param blogService ブログサービス。
	 */
	constructor(
		private blogService: BlogService) { }

	/**
	 * コンポーネント起動時の処理。
	 * @return 処理状態。
	 */
	ngOnInit(): Promise<void> {
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
	 * ブログ一覧を検索する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async loadPage(page: number): Promise<void> {
		const info = await this.blogService.find((page - 1) * this.pageMax, this.pageMax);
		this.length = info.count;
		this.blogs = info.list;
	}

	/**
	 * ブログ編集フォームを開く。
	 * @param id ブログID。新規は無し。
	 * @returns 処理状態。
	 */
	async openForm(id: number = 0): Promise<void> {
		this.error = '';
		this.blogForm = {};
		if (id) {
			this.blogForm = await this.blogService.findById(id);
		}
		this.formModal.show();
	}

	/**
	 * ブログを登録／更新する。
	 * @returns 処理状態。
	 */
	async submitForm(): Promise<void> {
		this.error = '';
		try {
			if (this.blogForm.id) {
				await this.blogService.update(this.blogForm);
			} else {
				await this.blogService.insert(this.blogForm);
			}
			await this.loadPage(this.currentPage);
			this.closeForm();
		} catch (e) {
			this.error = e.message || e;
		}
	}

	/**
	 * ブログ編集フォームを閉じる。
	 */
	closeForm(): void {
		this.formModal.hide();
		this.blogForm = null;
	}

	/**
	 * 削除確認ダイアログを開く。
	 * @param id ブログID。 
	 * @returns 処理状態。
	 */
	async confirmDelete(id: number): Promise<void> {
		this.error = '';
		this.blogForm = await this.blogService.findById(id);
		this.deleteModal.show();
	}

	/**
	 * 削除を行う。
	 * @returns 処理状態。
	 */
	async delete(): Promise<void> {
		this.error = '';
		try {
			await this.blogService.delete(this.blogForm.id);
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
		this.blogForm = null;
	}
}
