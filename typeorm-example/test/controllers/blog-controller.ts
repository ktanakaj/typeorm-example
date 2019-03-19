/**
 * @file blog-controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { Container } from 'typedi';
import { NotFoundError } from 'routing-controllers';
import { Blog } from '../../src/entities/blog';
import { BlogService } from '../../src/services/blog-service';
import { BlogController } from '../../src/controllers/blog-controller';

describe('BlogController', () => {
	before(async () => {
		// sqliteへのテストデータ登録
		const blogService = Container.get(BlogService);
		const blog = new Blog();
		blog.title = 'UNITTEST BLOG1';
		blog.author = 'UNITTEST AUTHOR1';
		await blogService.insert(blog);
	});

	describe('#getAll()', () => {
		it('should return blogs', async () => {
			const controller = Container.get(BlogController);
			const result = await controller.getAll(0, 10);
			assert(result.count > 0);
			const blogs = result.list.filter((b) => b.title === 'UNITTEST BLOG1');
			assert.strictEqual(blogs.length, 1);
			assert.strictEqual(blogs[0].author, 'UNITTEST AUTHOR1');
			assert.strictEqual(typeof blogs[0].id, 'number');
		});
	});

	describe('#getOne()', () => {
		it('should return blog', async () => {
			const controller = Container.get(BlogController);
			// FIXME: 今後テスト追加すると順番によってはIDがずれる
			const blog = await controller.getOne(1);
			assert.strictEqual(blog.title, 'UNITTEST BLOG1');
			assert.strictEqual(blog.author, 'UNITTEST AUTHOR1');
			assert.strictEqual(blog.id, 1);
		});

		it('should return error for not found', async () => {
			const controller = Container.get(BlogController);
			try {
				await controller.getOne(9999);
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
			}
		});
	});

	describe('#post()', () => {
		it('should create blog', async () => {
			const controller = Container.get(BlogController);
			const reqBlog = new Blog();
			reqBlog.title = 'Unittest created 1';
			reqBlog.author = 'UNITTEST AUTHOR1';
			const resBlog = await controller.post(reqBlog);
			assert.strictEqual(resBlog.title, 'Unittest created 1');
			assert.strictEqual(resBlog.author, 'UNITTEST AUTHOR1');
			assert.strictEqual(typeof resBlog.id, 'number');
		});
	});
});