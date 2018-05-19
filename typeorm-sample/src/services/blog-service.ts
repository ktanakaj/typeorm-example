/**
 * ブログサービスクラスのモジュール。
 * @module ./services/blog-service
 */
import { Service } from "typedi";
import { Repository, FindManyOptions } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Blog } from "../entities/blog";
import { Article } from "../entities/article";

/**
 * ブログサービスクラス。
 */
@Service()
export class BlogService {
	/** ブログエンティティリポジトリ */
	@OrmRepository(Blog)
	private blogRepository: Repository<Blog>;
	/** ブログ記事エンティティリポジトリ */
	@OrmRepository(Article)
	private articleRepository: Repository<Article>;

	/**
	 * ブログ一覧を取得する。
	 * @param skip 検索開始位置。未指定時は0。
	 * @param take 検索件数。未指定時は制限なし。
	 * @returns ブログ一覧。
	 */
	async findAndCount(skip: number = 0, take: number = Number.MAX_SAFE_INTEGER): Promise<[Blog[], number]> {
		const op: FindManyOptions<Blog> = { skip, take };
		return this.blogRepository.findAndCount(op);
	}

	/**
	 * 指定されたIDのブログを取得する。
	 * @param id ブログID。
	 * @returns ブログ。
	 */
	async findOne(id): Promise<Blog> {
		const blog = await this.blogRepository.findOne(id);
		if (!blog) {
			throw new NotFoundError(`blog is not found`);
		}
		return blog;
	}

	/**
	 * ブログを作成する。
	 * @param blog 作成するブログ。
	 * @returns 作成後のブログ。
	 */
	async insert(blog: Blog): Promise<Blog> {
		let count = await this.blogRepository.count({ title: blog.title });
		if (count > 0) {
			throw new BadRequestError(`blog title is already existed`);
		}
		return this.blogRepository.save(blog);
	}

	/**
	 * ブログを更新する。
	 * @param blog 更新するブログ。
	 * @returns 更新したブログ。
	 */
	async update(blog: Blog): Promise<Blog> {
		const old = await this.blogRepository.findOne(blog.id);
		if (!old) {
			throw new NotFoundError(`blog is not found`);
		}
		let check = await this.blogRepository.findOne({ title: blog.title });
		if (check && check.id !== old.id) {
			throw new BadRequestError(`blog title is already existed`);
		}
		return this.blogRepository.save(Object.assign(old, blog));
	}

	/**
	 * ブログを削除する。
	 * @param id 削除するブログのID。
	 * @returns 削除したブログ。
	 */
	async delete(id: number): Promise<Blog> {
		const blog = await this.blogRepository.findOne(id);
		if (!blog) {
			throw new NotFoundError(`blog is not found`);
		}
		let count = await this.articleRepository.count({ where: { blogId: id } });
		if (count > 0) {
			throw new BadRequestError(`blog has articles`);
		}
		return this.blogRepository.remove(blog);
	}
}
