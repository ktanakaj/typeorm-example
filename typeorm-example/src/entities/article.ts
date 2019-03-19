/**
 * ブログ記事エンティティクラスのモジュール。
 * @module ./entities/article
 */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Blog } from './blog';
import { Tag } from './tag';

/**
 * ブログ記事エンティティクラス。
 */
@Entity()
export class Article {
	/** 記事ID */
	@PrimaryGeneratedColumn()
	id: number;

	/** ブログ */
	@ManyToOne(type => Blog, blog => blog.articles, {
		nullable: false,
	})
	@JoinColumn({ name: 'blogId' })
	blog: Blog;

	/** 記事タイトル */
	@Column()
	@IsNotEmpty()
	title: string;

	/** 本文 */
	@Column('text')
	@IsNotEmpty()
	body: string;

	/** 登録日時 */
	@CreateDateColumn()
	createdAt: Date;

	/** 最終更新日時 */
	@UpdateDateColumn()
	updatedAt: Date;

	/** 記事のタグ */
	@ManyToMany(type => Tag, {
		cascade: ['insert'],
	})
	@JoinTable()
	tags: Tag[];
}