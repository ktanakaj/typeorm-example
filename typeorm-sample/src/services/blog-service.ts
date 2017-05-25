/**
 * ブログサービスクラスのモジュール。
 * @module ./services/blog-service
 */
import { Service } from "typedi";
import { Repository, FindOptions } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { Blog } from "../entities/blog";

/**
 * ブログサービスクラス。
 */
@Service()
export class BlogService {
	/** ブログエンティティリポジトリ */
	@OrmRepository(Blog)
	private blogRepository: Repository<Blog>;

	/**
	 * ブログ一覧を取得する。
	 * @param options 検索条件。
	 * @returns ブログ一覧。
	 */
	async findAndCount(options: { offset?: number, limit?: number, whereConditions?: {} } = {}): Promise<[Blog[], number]> {
		const op: FindOptions = {
			alias: 'blog',
			whereConditions: options.whereConditions,
			offset: options.offset || 0,
			limit: options.limit || Number.MAX_SAFE_INTEGER,
		};
		return this.blogRepository.findAndCount(op);
	}

	/**
	 * 指定されたIDのブログを取得する。
	 * @param id ブログID。
	 * @returns ブログ。
	 */
	async findOneById(id): Promise<Blog> {
		const blog = await this.blogRepository.findOneById(id);
		if (!blog) {
			throw new NotFoundError(`blog id=${id} is not found`);
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
			throw new BadRequestError(`blog title=${blog.title} is already existed`);
		}
		return this.blogRepository.persist(blog);
	}

	/**
	 * ブログを更新する。
	 * @param blog 更新するブログ。
	 * @returns 更新したブログ。
	 */
	async update(blog: Blog): Promise<Blog> {
		const old = await this.blogRepository.findOneById(blog.id);
		if (!old) {
			throw new NotFoundError(`blog id=${blog.id} is not found`);
		}
		let count = await this.blogRepository.count({ title: blog.title });
		if (count > 0) {
			throw new BadRequestError(`blog title=${blog.title} is already existed`);
		}
		return this.blogRepository.persist(Object.assign(old, blog));
	}

	/**
	 * ブログを削除する。
	 * @param id 削除するブログのID。
	 * @returns 削除したブログ。
	 */
	async delete(id: number): Promise<Blog> {
		const blog = await this.blogRepository.findOneById(id);
		if (!blog) {
			throw new NotFoundError(`blog id=${id} is not found`);
		}
		return this.blogRepository.remove(blog);
	}
}
