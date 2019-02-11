/**
 * ブログ記事サービスクラスのモジュール。
 * @module ./services/article-service
 */
import { Service } from "typedi";
import { Repository, FindManyOptions } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Blog } from "../entities/blog";
import { Article } from "../entities/article";
import { Tag } from "../entities/tag";

/**
 * ブログ記事サービスクラス。
 */
@Service()
export class ArticleService {
	/** ブログエンティティリポジトリ */
	@OrmRepository(Blog)
	private blogRepository: Repository<Blog>;
	/** ブログ記事エンティティリポジトリ */
	@OrmRepository(Article)
	private articleRepository: Repository<Article>;
	/** タグエンティティリポジトリ */
	@OrmRepository(Tag)
	private tagRepository: Repository<Tag>;

	/**
	 * ブログ記事一覧を取得する。
	 * @param skip 検索開始位置。未指定時は0。
	 * @param take 検索件数。未指定時は制限なし。
	 * @param blogId ブログIDで絞り込む場合そのID。
	 * @param tag タグで絞り込む場合そのタグ。
	 * @returns ブログ記事一覧。
	 */
	async findAndCount(skip: number = 0, take: number = Number.MAX_SAFE_INTEGER, blogId: number = null, tag: string = null): Promise<[Article[], number]> {
		const where = {};
		if (blogId) {
			where['blog'] = { id: blogId };
		}
		if (tag) {
			// FIXME: It't not working in typeorm 0.2.6
			// where['tags'] = [{ tag }];
		}
		const op: FindManyOptions<Article> = { where, skip, take, relations: ['blog', 'tags'] };
		return this.articleRepository.findAndCount(op);
	}

	/**
	 * 指定されたIDのブログ記事を取得する。
	 * @param id ブログ記事ID。
	 * @returns ブログ記事。
	 */
	async findOne(id): Promise<Article> {
		const article = await this.articleRepository.findOne(id, {
			relations: ['blog', 'tags'],
		});
		if (!article) {
			throw new NotFoundError(`article is not found`);
		}
		return article;
	}

	/**
	 * ブログ記事を作成する。
	 * @param article 作成するブログ記事。
	 * @returns 作成後のブログ記事。
	 */
	async insert(article: Article): Promise<Article> {
		const blog = await this.blogRepository.findOne(article.blog.id);
		if (!blog) {
			throw new NotFoundError(`blog is not found`);
		}
		article.tags = await this.relateTags(article.tags);
		return this.articleRepository.save(article);
	}

	/**
	 * ブログ記事を更新する。
	 * @param article 更新するブログ記事。
	 * @returns 更新したブログ記事。
	 */
	async update(article: Article): Promise<Article> {
		const old = await this.findOne(article.id);
		if (!old) {
			throw new NotFoundError(`article is not found`);
		}
		if (article.blog.id !== old.blog.id) {
			throw new BadRequestError(`blog id can't be changed`);
		}
		article.tags = await this.relateTags(article.tags);
		return this.articleRepository.save(Object.assign(old, article));
	}

	/**
	 * ブログ記事を削除する。
	 * @param id 削除するブログ記事のID。
	 * @returns 削除したブログ記事。
	 */
	async delete(id: number): Promise<Article> {
		const article = await this.findOne(id);
		if (!article) {
			throw new NotFoundError(`article is not found`);
		}
		return this.articleRepository.remove(article);
	}

	/**
	 * タグが既に存在する場合にそのインスタンスに置き換える。
	 * @param tags 置き換えるタグ配列。
	 * @returns 置き換え後のタグ配列。
	 */
	async relateTags(tags: Tag[]): Promise<Tag[]> {
		let results: Tag[] = [];
		for (let tag of tags) {
			let t = await this.tagRepository.findOne({ tag: tag.tag });
			results.push(t ? t : tag);
		}
		return results;
	}
}
