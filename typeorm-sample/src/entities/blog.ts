/**
 * ブログエンティティクラスのモジュール。
 * @module ./dao/entities/blog
 */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Article } from "./article";

/**
 * ブログエンティティクラス。
 */
@Entity()
export class Blog {
	/** ブログID */
	@PrimaryGeneratedColumn()
	id: number;

	/** ブログタイトル */
	@Column({ unique: true })
	@IsNotEmpty()
	title: string;

	/** 作者 */
	@Column()
	@IsNotEmpty()
	author: string;

	/** 開設日時 */
	@CreateDateColumn()
	createdAt: Date;

	/** 最終更新日時 */
	@UpdateDateColumn()
	updatedAt: Date;

	/** ブログの記事 */
	@OneToMany(type => Article, article => article.blog)
	articles: Article[];
}