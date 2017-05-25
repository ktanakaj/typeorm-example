/**
 * ブログ記事コントローラクラスのモジュール。
 * @module ./controllers/article-controller
 */
import { JsonController, Param, Body, Get, Post, Put, Delete, Render, OnUndefined, Redirect, QueryParam } from "routing-controllers";
import { Inject } from "typedi";
import { Article } from "../entities/article"
import { ArticleService } from "../services/article-service"

/**
 * @swagger
 * tags:
 *   name: articles
 *   description: ブログ記事API
 *
 * parameters:
 *   articleIdPathParam:
 *     in: path
 *     name: id
 *     description: ブログ記事ID
 *     required: true
 *     type: integer
 *     format: int32
 *
 * definitions:
 *   BlogIdParams:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: integer
 *         format: int32
 *         description: ブログID
 *   ArticleParams:
 *     type: object
 *     required:
 *       - title
 *       - body
 *     properties:
 *       title:
 *         type: string
 *         description: 記事タイトル
 *       body:
 *         type: string
 *         description: 記事本文
 *       blog:
 *         $ref: '#/definitions/BlogIdParams'
 *       tags:
 *         type: array
 *         description: タグ
 *         items:
 *           $ref: '#/definitions/TagParams'
 *   Article:
 *     allOf:
 *       - $ref: '#/definitions/ArticleParams'
 *       - required:
 *         - id
 *       - properties:
 *           id:
 *             type: integer
 *             format: int32
 *             description: ブログ記事ID
 *           createdAt:
 *             type: string
 *             format: date-time
 *             description: 登録日時
 *           updatedAt:
 *             type: string
 *             format: date-time
 *             description: 更新日時
 *           blog:
 *             $ref: '#/definitions/Blog'
 *           tags:
 *             type: array
 *             description: タグ
 *             items:
 *               $ref: '#/definitions/Tag'
 *   TagParams:
 *     type: object
 *     required:
 *       - tag
 *     properties:
 *       tag:
 *         type: string
 *         description: タグ名
 *   Tag:
 *     allOf:
 *       - $ref: '#/definitions/TagParams'
 *       - required:
 *         - id
 *         - tag
 *       - properties:
 *           id:
 *             type: integer
 *             format: int32
 *             description: タグID
 *           createdAt:
 *             type: string
 *             format: date-time
 *             description: 登録日時
 */

/**
 * ブログ記事コントローラクラス。
 */
@JsonController("/articles")
export class BlogController {

	/**
	 * ブログ記事サービス。
	 */
	@Inject()
	articleService: ArticleService;

	/**
	 * @swagger
	 * /articles:
	 *   get:
	 *     tags:
	 *       - articles
	 *     summary: ブログ記事一覧
	 *     description: ブログ記事の一覧を取得する。
	 *     parameters:
	 *       - $ref: '#/parameters/offset'
	 *       - $ref: '#/parameters/limit'
	 *       - in: query
	 *         name: blogId
	 *         description: ブログID
	 *         type: integer
	 *         format: int32
	 *       - in: query
	 *         name: tag
	 *         description: タグ
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: 取得成功
	 *         schema:
	 *           type: object
	 *           properties:
	 *             list:
	 *               type: array
	 *               items:
	 *                 $ref: '#/definitions/Article'
	 *             count:
	 *               type: integer
	 *               format: int32
	 *               description: 総件数
	 */
	@Get("/")
	getAll( @QueryParam("offset") offset: number, @QueryParam("limit") limit: number, @QueryParam("blogId") blogId: number, @QueryParam("tag") tag: string): Promise<{ list: Article[], count: number }> {
		const whereConditions = {};
		if (blogId) {
			whereConditions['blogId'] = blogId;
		}
		if (tag) {
			whereConditions['tags.tag'] = tag;
		}
		return this.articleService.findAndCount({ offset, limit, whereConditions })
			.then(([list, count]) => { return { list, count }; });
	}

	/**
	 * @swagger
	 * /articles/{id}:
	 *   get:
	 *     tags:
	 *       - articles
	 *     summary: ブログ記事取得
	 *     description: ブログ記事を取得する。
	 *     parameters:
	 *       - $ref: '#/parameters/articleIdPathParam'
	 *     responses:
	 *       200:
	 *         description: 取得成功
	 *         schema:
	 *           $ref: '#/definitions/Article'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Get("/:id")
	getOne( @Param("id") id: number): Promise<Article> {
		return this.articleService.findOneById(id);
	}

	/**
	 * @swagger
	 * /articles:
	 *   post:
	 *     tags:
	 *       - articles
	 *     summary: ブログ記事登録
	 *     description: ブログ記事を新規登録する。
	 *     parameters:
	 *       - in: body
	 *         name: body
	 *         description: ブログ記事
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/ArticleParams'
	 *     responses:
	 *       200:
	 *         description: 登録成功
	 *         schema:
	 *           $ref: '#/definitions/Article'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 */
	@Post("/")
	post( @Body({ required: true }) article: Article): Promise<Article> {
		return this.articleService.insert(article);
	}

	/**
	 * @swagger
	 * /articles/{id}:
	 *   put:
	 *     tags:
	 *       - articles
	 *     summary: ブログ記事更新
	 *     description: ブログ記事を更新する。
	 *     parameters:
	 *       - $ref: '#/parameters/articleIdPathParam'
	 *       - in: body
	 *         name: body
	 *         description: ブログ記事
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/ArticleParams'
	 *     responses:
	 *       200:
	 *         description: 更新成功
	 *         schema:
	 *           $ref: '#/definitions/Article'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Put("/:id")
	put( @Param("id") id: number, @Body({ required: true }) article: Article): Promise<Article> {
		article.id = id;
		return this.articleService.update(article);
	}

	/**
	 * @swagger
	 * /articles/{id}:
	 *   delete:
	 *     tags:
	 *       - articles
	 *     summary: ブログ記事削除
	 *     description: ブログ記事を削除する。
	 *     parameters:
	 *       - $ref: '#/parameters/articleIdPathParam'
	 *     responses:
	 *       200:
	 *         description: 削除成功
	 *         schema:
	 *           $ref: '#/definitions/Article'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 */
	@Delete("/:id")
	remove( @Param("id") id: number): Promise<Article> {
		return this.articleService.delete(id);
	}
}