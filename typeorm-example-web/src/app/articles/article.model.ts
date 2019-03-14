/**
 * ブログ記事モデルモジュール。
 * @module ./app/articles/article.model
 */
import { Blog } from '../blogs/blog.model';
import { Tag } from './tag.model';

/**
 * ブログ記事モデル。
 */
export interface Article {
	id?: number;
	blog?: Blog;
	title?: string;
	body?: string;
	createdAt?: Date;
	updatedAt?: Date;
	tags?: Tag[];
}
