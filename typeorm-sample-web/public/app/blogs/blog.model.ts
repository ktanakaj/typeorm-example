/**
 * ブログモデルモジュール。
 * @module ./app/blogs/blog.model
 */

/**
 * ブログモデル。
 */
export interface Blog {
	id?: number;
	title?: string;
	author?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
