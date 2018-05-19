/**
 * ブログコントローラクラスのモジュール。
 * @module ./controllers/blog-controller
 */
import { JsonController, Param, Body, Get, Post, Put, Delete, QueryParam } from "routing-controllers";
import { Inject } from "typedi";
import { Blog } from "../entities/blog"
import { BlogService } from "../services/blog-service"

/**
 * @swagger
 * tags:
 *   - name: blogs
 *     description: ブログAPI
 *
 * parameters:
 *   blogIdPathParam:
 *     in: path
 *     name: id
 *     description: ブログID
 *     required: true
 *     type: integer
 *     format: int32
 *
 * definitions:
 *   BlogParams:
 *     type: object
 *     required:
 *       - title
 *       - author
 *     properties:
 *       title:
 *         type: string
 *         description: ブログタイトル
 *       author:
 *         type: string
 *         description: 作者
 *   Blog:
 *     allOf:
 *       - $ref: '#/definitions/BlogParams'
 *       - required:
 *         - id
 *       - properties:
 *           id:
 *             type: integer
 *             format: int32
 *             description: ブログID
 *           createdAt:
 *             type: string
 *             format: date-time
 *             description: 登録日時
 *           updatedAt:
 *             type: string
 *             format: date-time
 *             description: 更新日時
 */

/**
 * ブログコントローラクラス。
 */
@JsonController("/blogs")
export class BlogController {

	/**
	 * ブログサービス。
	 */
	@Inject()
	blogService: BlogService;

	/**
	 * @swagger
	 * /blogs:
	 *   get:
	 *     tags:
	 *       - blogs
	 *     summary: ブログ一覧
	 *     description: ブログの一覧を取得する。
	 *     parameters:
	 *       - $ref: '#/parameters/offset'
	 *       - $ref: '#/parameters/limit'
	 *     responses:
	 *       200:
	 *         description: 取得成功
	 *         schema:
	 *           type: object
	 *           properties:
	 *             list:
	 *               type: array
	 *               items:
	 *                 $ref: '#/definitions/Blog'
	 *             count:
	 *               type: integer
	 *               format: int32
	 *               description: 総件数
	 */
	@Get("/")
	getAll(@QueryParam("offset") offset: number, @QueryParam("limit") limit: number): Promise<{ list: Blog[], count: number }> {
		return this.blogService.findAndCount(offset, limit)
			.then(([list, count]) => { return { list, count }; });
	}

	/**
	 * @swagger
	 * /blogs/{id}:
	 *   get:
	 *     tags:
	 *       - blogs
	 *     summary: ブログ取得
	 *     description: ブログを取得する。
	 *     parameters:
	 *       - $ref: '#/parameters/blogIdPathParam'
	 *     responses:
	 *       200:
	 *         description: 取得成功
	 *         schema:
	 *           $ref: '#/definitions/Blog'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Get("/:id")
	getOne(@Param("id") id: number): Promise<Blog> {
		return this.blogService.findOne(id);
	}

	/**
	 * @swagger
	 * /blogs:
	 *   post:
	 *     tags:
	 *       - blogs
	 *     summary: ブログ新規登録
	 *     description: ブログを新規登録する。
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: ブログ情報
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/BlogParams'
	 *     responses:
	 *       200:
	 *         description: 登録成功
	 *         schema:
	 *           $ref: '#/definitions/Blog'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 */
	@Post("/")
	post(@Body({ required: true }) blog: Blog): Promise<Blog> {
		return this.blogService.insert(blog);
	}

	/**
	 * @swagger
	 * /blogs/{id}:
	 *   put:
	 *     tags:
	 *       - blogs
	 *     summary: ブログ更新
	 *     description: ブログを更新する。
	 *     parameters:
	 *       - $ref: '#/parameters/blogIdPathParam'
	 *       - in: body
	 *         name: body
	 *         description: ブログ情報
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/BlogParams'
	 *     responses:
	 *       200:
	 *         description: 更新成功
	 *         schema:
	 *           $ref: '#/definitions/Blog'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Put("/:id")
	put(@Param("id") id: number, @Body({ required: true }) blog: Blog): Promise<Blog> {
		blog.id = id;
		return this.blogService.update(blog);
	}

	/**
	 * @swagger
	 * /blogs/{id}:
	 *   delete:
	 *     tags:
	 *       - blogs
	 *     summary: ブログ削除
	 *     description: ブログを削除する。
	 *     parameters:
	 *       - $ref: '#/parameters/blogIdPathParam'
	 *     responses:
	 *       200:
	 *         description: 削除成功
	 *         schema:
	 *           $ref: '#/definitions/Blog'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Delete("/:id")
	remove(@Param("id") id: number): Promise<Blog> {
		return this.blogService.delete(id);
	}
}